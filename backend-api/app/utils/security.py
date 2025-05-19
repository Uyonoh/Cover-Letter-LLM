from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

# Initialize Bearer scheme with auto_error=False to handle missing tokens gracefully
bearer_scheme = HTTPBearer(auto_error=False)

def verify_supabase_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)
):
    # Case 1: No credentials provided
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Case 2: Credentials exist but are invalid
    try:
        token = credentials.credentials  # Now safe to access
        payload = jwt.decode(
            token,
            os.getenv("SUPABASE_JWT_SECRET"),
            algorithms=["HS256"],
            options={"verify_iss": True}
        )
        return payload
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )