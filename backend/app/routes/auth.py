from fastapi import APIRouter, Response, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.models.schemas import BaseModel, User, UserProfile, UserCreateForm, UserLoginForm
from app.services.db import get_supabase_client, verify_token, Client
from supabase_auth.errors import AuthApiError
import os

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
        raise HTTPException(status_code=400, detail="Missing access token")

    response.set_cookie(
        key="sb_access_token",
        value=token,
        httponly=True,
        secure=False,          # True in production (HTTPS)
        samesite="lax",       # or "strict" depending on your needs
        max_age=60 * 60 * 24  # 1 day
    )
    return {"message": "Auth cookie set"}

@router.delete("")
async def clear_auth_cookie(response: Response):
    """
    Clear the auth cookie (logout).
    """
    response.delete_cookie("sb_access_token")
    return {"message": "Auth cookie cleared"}

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
            return JSONResponse({"message": "This email already exists"}, status_code=401)
        return JSONResponse({"message": "Invalid email/password"}, status_code=401)
    except Exception as e:
        print(f"Unknown Error: {e}")
        return JSONResponse({"message": "Network error!\nTry again later or contact support."}, status_code=401)
    
    if ENV == "dev":
        return JSONResponse({"access_token": access_token}, status_code=201)
    return JSONResponse({"message", "Signup successful"}, status_code=201)


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
        return JSONResponse({"message": "Invalid login credentials"}, status_code=401)
    except Exception as e:
        return JSONResponse({"message": "Network error!\nTry again later or contact support."}, status_code=401)

    if not user.session:
        return JSONResponse({"message": "Invalid credentials"}, status_code=401)

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
        return JSONResponse({"access_token": access_token}, status_code=200)
    return JSONResponse({"message": "Login successful"}, status_code=200)
