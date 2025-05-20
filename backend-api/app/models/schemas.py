from pydantic import BaseModel
from typing import Optional

class TokenResponse(BaseModel):
    token: str

class CoverLetterRequest(BaseModel):
    job_description: str

class CoverLetterResponse(BaseModel):
    id: str
    user_id: str
    content: str
    job_description: str
    created_at: str