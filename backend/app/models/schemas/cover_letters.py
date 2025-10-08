from pydantic import BaseModel, Json
from typing import Any, Dict
import uuid
from uuid import UUID
from datetime import datetime
from .jobs import Job


class CoverLetter(BaseModel):
    id: UUID
    user_id: UUID
    job_id: UUID
    content: str
    version: int
    created_at: datetime
    # updated_at: datetime
    

class GenerateLetterRequest(BaseModel):
    job_title: str
    job_description: str
    style: str
    length: str
    modifiers: list[str]

class ListLetterResponse(BaseModel):
  id: str
  jobs: Job
  content: str
  created_at: datetime

class ViewLetterResponse(BaseModel):
  id: str
  jobs: Job
  content: str
  created_at: datetime
