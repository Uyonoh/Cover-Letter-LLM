from fastapi import APIRouter, Depends, Request, HTTPException
from app.dependencies import get_current_user
from app.services.db import get_supabase_client, get_service_client, verify_token, Client, User
from app.services.gemini import generate_cover_letter, resume
from app.models.schemas.cover_letters import GenerateLetterRequest, CoverLetter, ModelResponse, datetime, uuid, Dict, Any
import os

ENV = os.getenv("ENV", "dev")
router = APIRouter(prefix="/letters", tags=["letters"])

# In-memory storage for demo (replace with Supabase in production)
letters_db = {}

@router.get("")
async def get_letters(
    request: Request,
    user: Dict[str, Any]=Depends(get_current_user),
    supabase: Client=Depends(get_supabase_client),
    ):

    if ENV == "dev":
        auth = request.headers.get("authorization")
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ")[1]
        supabase.postgrest.auth(token)

    res = (
        supabase.table("cover_letters")
        .select("id, content, created_at, jobs(title, company)")
        .eq("user_id", user["sub"])
        .order("created_at", desc=True)
        .execute()
    )

    print(f"REsponse = {res}")
    headings = ["Title", "Company", "Date Created", "Actions"]
    return {"headings": headings, "letters": res.data}

@router.post("")
async def generate(
    request: Request,
    body: GenerateLetterRequest,
    user: Dict[str, Any]=Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
) -> dict[str, Any]:

    # Ensure user is authenticatd using their JWT token
    if ENV == "dev":
        auth = request.headers.get("authorization")
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ")[1]
        supabase.postgrest.auth(token)

    user_id: str = user["sub"]

    # Generate Cover letter
    try:
        content: ModelResponse = await generate_cover_letter(
            model="gemini-2.5-flash",
            request=body,
            resume_text=resume,
        )

        job = {
            "user_id": user_id,
            # Prefer user-provided job_title, otherwise use extracted one
            "title": body.job_title or content.job_title,
            "company": content.company_name or "NIL",
            "description": body.job_description,
            "location": content.location,
            "employment_type": content.employment_type,
            "seniority_level": content.seniority_level,
            "salary": content.salary,
        }

        res = supabase.table("jobs").insert(job).execute()
        job_id = res.data[0].get("id")
        # content = predict(request.job_title, request.job_description)

        data: CoverLetter = {
            "user_id": user_id,
            "job_id": job_id,
            "content": content.description,
            "version": 1,
            "style": body.style,
            "length": body.length,
            "modifiers": body.modifiers,
        }

        res = supabase.table("cover_letters").insert(data).execute()
        letter_id = res.data[0].get("id")

        return {"letter_id": letter_id}

    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))

@router.get("/{letter_id}")
async def view(
    request: Request,
    letter_id,
    user: Dict[str, Any]=Depends(get_current_user),
    supabase: Client=Depends(get_supabase_client),
):
    
    if ENV == "dev":
        auth = request.headers.get("authorization")
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ")[1]
        supabase.postgrest.auth(token)

    res = (
        supabase.table("cover_letters")
        .select("*, jobs(*)")
        .eq("user_id", user["sub"])
        .eq("id", letter_id)
        .order("created_at", desc=True)
        .execute()
    )

    print(f"View Response = {res}")
    
    return {"letter": res.data[0]}