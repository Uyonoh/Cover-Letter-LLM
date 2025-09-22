from fastapi import APIRouter, Depends, HTTPException
from app.services.db import get_supabase_client, verify_supabase_token, Client
from app.models.schemas import CoverLetterRequest, CoverLetterResponse, datetime, uuid, Any

router = APIRouter(prefix="/letters", tags=["letters"])

# In-memory storage for demo (replace with Supabase in production)
letters_db = {}

# Generate returns status code and message, redirects to view
@router.post("")
async def generate(
    request: CoverLetterRequest,
    user: dict = Depends(verify_supabase_token),
    supabase: Client = Depends(get_supabase_client)
) -> dict[str, Any]:
    letter_id = str(uuid.uuid4())
    letter_content = "Random bullshit GO!!!"
    job_title = "Random JOb"
    letters_db[letter_id] = {
        # "id": letter
        "user_id": "7546ab7b-20a2-4941-8453-f064ea60903f", # Temporary placeholder for user ID
        "text": letter_content,
        "job_title": job_title,
        "job_description": "",#request.job_description,
        "created_at": datetime.now().isoformat()
    }

    supabase.table("letters").insert(letters_db[letter_id]).execute()
    return letters_db[letter_id]