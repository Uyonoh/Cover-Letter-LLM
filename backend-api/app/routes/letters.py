from fastapi import APIRouter, Depends, HTTPException
from app.services.ai import generate_cover_letter
from app.utils.security import verify_supabase_token
from app.models.schemas import CoverLetterRequest, CoverLetterResponse
from typing import List
import uuid
from datetime import datetime

router = APIRouter(prefix="/letters", tags=["letters"])

# In-memory storage for demo (replace with Supabase in production)
letters_db = {}

@router.post("/generate-letter", response_model=CoverLetterResponse)
async def generate_letter(
    request: CoverLetterRequest,
    user: dict = Depends(verify_supabase_token)
):
    # In production: Fetch resume from Supabase storage
    resume_text = "Sample resume text"  # Replace with actual resume fetch
    
    letter_content = await generate_cover_letter(
        resume_text=resume_text,
        job_description=request.job_description
    )
    
    if not letter_content:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate cover letter"
        )
    
    letter_id = str(uuid.uuid4())
    letters_db[letter_id] = {
        "id": letter_id,
        "user_id": user.get("sub"),
        "content": letter_content,
        "job_description": request.job_description,
        "created_at": datetime.now().isoformat()
    }
    
    return letters_db[letter_id]

@router.get("/", response_model=List[CoverLetterResponse])
async def list_letters(user: dict = Depends(verify_supabase_token)):
    return [
        letter for letter in letters_db.values() 
        if letter["user_id"] == user.get("sub")
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