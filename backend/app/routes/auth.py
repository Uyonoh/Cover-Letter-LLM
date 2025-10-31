from fastapi import APIRouter, Request, Response, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.dependencies import get_current_user
from app.utils.response import error_response, success_response, RESPONSE_ERRORS
from app.models.schemas.auth import BaseModel, User, UserProfile, UserCreateForm, UserLoginForm, Dict, Any
from app.services.db import get_supabase_client, get_service_client, verify_token, Client
from supabase_auth.errors import AuthApiError
import os
from app.core.logging import logger

router = APIRouter(prefix="/auth", tags=["auth"])
ENV = os.getenv("ENV", "dev")

class TokenPayload(BaseModel):
    access_token: str

@router.post("")
async def set_auth_cookie(payload: TokenPayload, response: Response):
    """
    Store the Supabase access_token in an HttpOnly cookie.
    """
    token = payload.access_token
    if not token:
        return error_response("Missing access token", error_code=RESPONSE_ERRORS.BAD_REQUEST, status_code=400)

    response.set_cookie(
        key="sb_access_token",
        value=token,
        httponly=True,
        secure=False,          # True in production (HTTPS)
        samesite="lax",       # or "strict" depending on your needs
        max_age=60 * 60 * 24  # 1 day
    )
    return success_response(message="Auth cookie set", status_code=200)

@router.delete("")
async def clear_auth_cookie(response: Response):
    """
    Clear the auth cookie (logout).
    """
    response.delete_cookie("sb_access_token")
    return success_response(message="Auth cookie cleared", status_code=200)

@router.post("/register")
async def register(
    body: UserCreateForm,
    response: Response,
    supabase: Client = Depends(get_supabase_client),
):

    try:

        user = supabase.auth.sign_up({"email": body.email, "password": body.password})
        access_token = user.session.access_token

        profile: UserProfile = {
            "id": user.user.id,
            "first_name": body.first_name,
            "last_name": body.last_name,
        }

        supabase.table("profiles").insert(profile).execute()

        # Set secure httpOnly cookie
        response.set_cookie(
            key="sb_access_token",
            value=access_token,
            httponly=True,
            secure=False,  # only over HTTPS in production
            samesite="none",
            max_age=60 * 60 * 24  # 1 day
        )
    except AuthApiError as e:
        if e.message == "User already registered":
            return error_response("This email already exists", error_code=RESPONSE_ERRORS.CONFLICT_ERROR, status_code=403)
        return error_response("Invalid email/password", error_code=RESPONSE_ERRORS.UNAUTHORIZED_ERROR, status_code=401)
    except Exception as e:
        return error_response("Network error!\nTry again later or contact support.", error_code=RESPONSE_ERRORS.UNKNOWN_ERROR, status_code=401)
    
    if ENV == "dev":
        return success_response({"access_token": access_token}, status_code=201)
    return success_response(message="Signup successful", status_code=201)


@router.post("/login")
async def login(
    body: UserLoginForm,
    response: Response,
    supabase: Client = Depends(get_supabase_client),
    ):
    
    # Use supabase client here to authenticate
    try:
        user = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
    except AuthApiError:
        return error_response("Invalid login credentials", error_code=RESPONSE_ERRORS.UNAUTHORIZED_ERROR, status_code=401)
    except Exception as e:
        return error_response("Network error!\nTry again later or contact support.", error_code=RESPONSE_ERRORS.UNKNOWN_ERROR, status_code=401)

    if not user.session:
        return error_response("Invalid user", error_code=RESPONSE_ERRORS.UNAUTHORIZED_ERROR, status_code=401)

    access_token = user.session.access_token

    # Set secure httpOnly cookie
    response.set_cookie(
        key="sb_access_token",
        value=access_token,
        httponly=True,
        secure=False,  # only over HTTPS in production
        samesite="none",
        max_age=60 * 60 * 24  # 1 day
    )

    if ENV == "dev":
        return success_response({"access_token": access_token}, status_code=200)
    return success_response(message="Login successful", status_code=200)

@router.post("/delete-account")
async def delete_account(
    
    response: Response,
    user: Dict[str, Any]=Depends(get_current_user),
    supabase: Client = Depends(get_service_client),
):
    """
    Deletes the authenticated user's account and associated profile data.
    This endpoint performs the following actions:
    - Deletes the user from the authentication system.
    - Removes any additional user-related data (extend as needed).
    - Clears the user's access token cookie.
    Args:
        response (Response): The response object used to modify cookies.
        user (Dict[str, Any]): The currently authenticated user, injected via dependency.
        supabase (Client): The Supabase client instance, injected via dependency.
    Raises:
        HTTPException: If an error occurs during account deletion.
    Returns:
        JSONResponse: A message indicating successful account deletion.
    """

    try:
        # Delete user from auth
        supabase.auth.admin.delete_user(user["sub"])

        # Delete other user-related data here

    except Exception as e:
        print(f"Error deleting account: {e}")
        return error_response("Error deleting account", error_code=RESPONSE_ERRORS.UNKNOWN_ERROR, status_code=500)

    response.delete_cookie("sb_access_token")
    return success_response(message="Account deleted successfully")