from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import TokenResponse, UserCreate, User
from app.services.db import get_service_client, Client
from app.services.encryption import hash_password, verify_password
from app.services.jwt import create_access_token, decode_access_token
from fastapi import Request
from typing import Dict, Any
import os, uuid, datetime

_TableT = Dict[str, Any]

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/token", response_model=TokenResponse)
def token():
    token = os.environ.get("SUPABASE_KEY")
    return {"token": token}

@router.post("/register")
def register(
    user: UserCreate,
    supabase: Client=Depends(get_service_client)
    ):

    existing: list[_TableT] = supabase.table("users").select("*").eq("email", user.email).execute().data
    print(f"EXISTING: {existing}")
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    hashed_pw = hash_password(user.password)
    # new_user = User(email=user.email, password=hashed_pw)
    payload = {
        # "id": str(uuid.uuid4()),
        "email": user.email,
        "hashed_password": hashed_pw,
        # "created_at": datetime.datetime.now().isoformat()
    }
    print(f"PAYLOAD: {payload}")
    supabase.table("users").insert(payload).execute()
    
    return {"message": "User created successfully"}
import time
@router.post("/login")
def login(
    user: UserCreate,
    supabase: Client=Depends(get_service_client)
    ):

    db_user: list[_TableT] = supabase.table("users").select("*").eq("email", user.email).execute().data
    print(f"USER: {db_user}")
    if not db_user or not verify_password(user.password, db_user[0].get("hashed_password")):#[0]["hashed_password"]):
        raise HTTPException(401, "Invalid credentials")
    
    token = create_access_token({"sub": str(db_user[0].get("user_id"))})
    return {"access_token": token, "token_type": "bearer"}