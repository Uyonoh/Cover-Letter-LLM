from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class User(BaseModel):
    id : UUID
    email: str
    hashed_password: str
    created_at: datetime

class UserCreate(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str

class CoverLetterRequest(BaseModel):
    job_description: str

class CoverLetterResponse(BaseModel):
    id: UUID
    user_id: UUID
    content: str
    job_description: str
    created_at: str