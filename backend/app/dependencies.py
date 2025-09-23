from fastapi import Request, HTTPException, status, Depends
from app.services.db import get_supabase_client, Client
import os
import jwt

SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"
ENV = os.getenv("ENV", "dev")

def get_current_user(
        request: Request,
        supabase: Client = Depends(get_supabase_client),
        ):

    token = None
    print(f"{ENV=}")
    if ENV == "prod":
        token = request.cookies.get("sb_access_token")
    else:
        auth = request.headers.get("authorization")
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ")[1]

    print(f"{token=}")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        user = supabase.auth.get_user(token)
        print(f"{user=}")
        if not user or not user.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token validation failed")

    return user.user