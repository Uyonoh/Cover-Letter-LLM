from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt
from supabase import create_client, Client
from supabase_auth.types import User
import os

security = HTTPBearer()
SUPABASE_JWT_SECRET  = os.getenv("SUPABASE_JWT_SECRET")

# Initialize Supabase client
def get_supabase_client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    return supabase

def get_service_client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase: Client = create_client(url, key)

    return supabase

# def get_user():
#     supabase.auth

def verify_token(
    authorization = Depends(security),
    supabase: Client = Depends(get_supabase_client)
    ):
    print("Verifying")
    token:str = authorization.credentials
    token = token.strip()[1:-1]
    try:
        # payload = jwt.decode(token.credentials, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        print(f"{token=}")
        payload = supabase.auth.get_user(token)
        print(f"Payload = {payload}")
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
