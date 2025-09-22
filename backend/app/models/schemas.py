from pydantic import BaseModel
from typing import Any
import uuid
from uuid import UUID
from datetime import datetime


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
    job_title: str
    job_description: str
    content: str
    # prompt: str
    created_at: datetime
    # updated_at: datetime