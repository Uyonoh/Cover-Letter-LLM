from pydantic import BaseModel
from typing import Optional

class CoverLetterRequest(BaseModel):
    job_description: str

class CoverLetterResponse(BaseModel):
    id: str
    user_id: str
    content: str
    job_description: str
    created_at: str