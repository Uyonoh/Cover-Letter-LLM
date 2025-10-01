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

class CoverLetterForm(BaseModel):
    job_title: str
    job_description: str

class Profile(BaseModel): pass
class Template(BaseModel): pass

class Job(BaseModel):
    user_id: UUID
    title: str
    company: str
    description: str
    # location: str
    # salary: int
    # requirements: 
    created_at: datetime
    # updated_at: datetime

class CoverLetter(BaseModel):
    id: UUID
    user_id: UUID
    job_id: UUID
    content: str
    version: int
    created_at: datetime
    # updated_at: datetime