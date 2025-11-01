from pydantic import BaseModel, Json
from typing import Any, Optional, Dict, List
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

class ModifyLetterRequest(BaseModel):
    job_title: str
    letter: str
    prompt: str


class ListLetterResponseLetter(BaseModel):
  id: str
  jobs: Job
  content: str
  created_at: datetime

class ListLetterResponseData(BaseModel):
   headings: List[str]
   letters: List[ListLetterResponseLetter]

class ViewLetterResponseLetter(CoverLetter):
  jobs: Job

class ViewLetterResponseData(BaseModel):
   letter: ViewLetterResponseLetter


class SkillsFromJD(BaseModel):
    backend: Optional[List[str]] = []
    frontend: Optional[List[str]] = []
    databases: Optional[List[str]] = []
    general: Optional[List[str]] = []
    devops: Optional[List[str]] = []

class ModelResponseData(BaseModel):
    job_title: str
    company_name: str
    location: Optional[str] = None
    employment_type: Optional[str] = None
    seniority_level: Optional[str] = None
    salary: Optional[str] = None
    benefits: Optional[List[str]] = []
    responsibilities: Optional[List[str]] = []
    qualifications: Optional[List[str]] = []
    preferred_skills: Optional[List[str]] = []
    skills: SkillsFromJD
    cover_letter: str