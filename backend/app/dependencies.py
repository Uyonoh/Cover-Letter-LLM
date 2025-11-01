from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.db import get_supabase_client, Client
import os
from jose import jwt, JWTError

SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=['HS256'],
            audience='authenticated'
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid or expired token')