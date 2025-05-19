from fastapi import APIRouter, Depends, HTTPException
from app.services.ai import generate_cover_letter
from app.utils.security import verify_supabase_token
from app.models.schemas import CoverLetterRequest, CoverLetterResponse
from app.services.db import supabase
from typing import List
import uuid
from datetime import datetime


router = APIRouter(prefix="/letters", tags=["letters"])

# In-memory storage for demo (replace with Supabase in production)
letters_db = {}

@router.post("/generate-letter")
async def generate_letter(
    request: CoverLetterRequest,
    user: dict = Depends(verify_supabase_token)
):
    # Get resume text from storage or database
    resume_text = "No jobs yet, but I am a strong learner" #get_resume_for_user(user['sub'])
    
    # Generate cover letter
    letter_content, error = await generate_cover_letter(
        resume_text=resume_text,
        job_description=request.job_description
    )
    
    if error:
        raise HTTPException(
            status_code=400 if "blocked" in error else 500,
            detail=error
        )
    
    letter_id = str(uuid.uuid4())
    letters_db[letter_id] = {
        "id": letter_id,
        "user_id": user.get("sub") or "7546ab7b-20a2-4941-8453-f064ea60903f", # Temporary placeholder for user ID
        "content": letter_content,
        "job_description": request.job_description,
        "created_at": datetime.now().isoformat()
    }
    response = supabase.table("letters").insert(letters_db[letter_id]).execute()
    print(response)

    return letters_db#[letter_id]

@router.get("/", response_model=List[CoverLetterResponse])
async def list_letters(user: dict = Depends(verify_supabase_token)):
    response: CoverLetterResponse = (supabase.table("letters").select("*").execute())#.eq("user_id", user.get("sub")).execute()
    print(response.data)
    # return response.data
    return [
        letter for letter in response.data
        # if letter["user_id"] == user.get("sub")
    ]

@router.get("/{letter_id}", response_model=CoverLetterResponse)
async def get_letter(
    letter_id: str,
    user: dict = Depends(verify_supabase_token)
):
    letter = letters_db.get(letter_id)
    if not letter or letter["user_id"] != user.get("sub"):
        raise HTTPException(status_code=404, detail="Letter not found")
    return letter