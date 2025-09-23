from fastapi import Request, HTTPException, status, Depends
from app.services.db import get_supabase_client, Client

def get_current_user(
        request: Request,
        supabase: Client = Depends(get_supabase_client),
        ):
    token = request.cookies.get("access_token")
    print(f"{token=}")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token validation failed")

    return user.user