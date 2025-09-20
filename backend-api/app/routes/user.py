from fastapi import APIRouter, Depends, HTTPException
from fastapi import Request
from typing import Any, Dict
import uuid
from app.services.db import supabase
from app.services.jwt import decode_access_token
_TableT = Dict[str, Any]

router = APIRouter(prefix="user", tags=["user"])


def get_current_user(request: Request, db=supabase):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Beaer "):
        raise HTTPException(401, "Missing token")
    
    token = auth.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(401, "Invalid token")
    
    user_id = payload.get("sub")
    user: list[_TableT] = db.table("users").select("*").eq("user_id", uuid(user_id)).execute()
    if not user:
        raise HTTPException(401, "User not found")
    
    return user[0]

@router.get("")
def user(user=Depends(get_current_user)):
    return {"email": user.get("email")}