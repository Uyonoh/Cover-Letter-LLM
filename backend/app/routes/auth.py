from fastapi import APIRouter, Response, Depends
from fastapi.responses import JSONResponse
from app.models.schemas import User, UserCreate
from app.services.db import get_supabase_client, verify_token, Client

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def login(
    request: UserCreate,
    response: Response,
    supabase: Client = Depends(get_supabase_client),
    ):
    # Use supabase client here to authenticate
    user = supabase.auth.sign_in_with_password({"email": request.email, "password": request.password})

    if not user.session:
        return JSONResponse({"error": "Invalid credentials"}, status_code=401)

    access_token = user.session.access_token

    # Set secure httpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # only over HTTPS in production
        samesite="none",
        expires=60 * 60 * 24  # 1 day
    )

    return {"message": "Login successful"}
