from pydantic import BaseModel
from typing import Any, Dict
import uuid
from uuid import UUID
from datetime import datetime

class Job(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    company: str
    description: str
    # location: str
    # salary: int
    # requirements: 
    created_at: datetime
    # updated_at: datetime
