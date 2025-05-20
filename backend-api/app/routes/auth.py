from fastapi import APIRouter
from app.models.schemas import TokenResponse
import os

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/token", response_model=TokenResponse)
async def token():
    token = os.environ.get("SUPABASE_KEY")
    return {"token": token}