from pydantic import BaseModel
from typing import Any
import uuid
from uuid import UUID
from datetime import datetime

class CoverLetterRequest(BaseModel):
    job_description: str

class CoverLetterResponse(BaseModel):
    id: UUID
    user_id: UUID
    letter: str
    job_title: str
    job_description: str
    # prompt: str
    created_at: datetime
    # updated_at: datetime