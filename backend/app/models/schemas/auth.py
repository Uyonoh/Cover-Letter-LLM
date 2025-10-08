from pydantic import BaseModel
from typing import Any, Dict
import uuid
from uuid import UUID
from datetime import datetime


class User(BaseModel):
    id : UUID
    email: str
    hashed_password: str
    created_at: datetime

class UserCreateForm(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str

class UserProfile(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    created_at: datetime

class UserLoginForm(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str