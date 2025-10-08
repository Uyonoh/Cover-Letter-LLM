from pydantic import BaseModel
from typing import Any, Dict
import uuid
from uuid import UUID
from datetime import datetime


class Profile(BaseModel): 
    id: str
    first_name: str
    last_name: str
    created_at: str
    profile_completed: bool