from fastapi import APIRouter, File, Depends, BackgroundTasks
import tempfile
import os
import asyncio
from datetime import datetime, timezone
from app.utils.text import extract_pdf_text, extract_docx_text
from app.services.gemini import parse_resume
from app.services.db import get_supabase_client, get_service_client, Client

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.post("/parse")
async def parse_resume_background(payload: dict, background_tasks: BackgroundTasks):
    user_id = payload["user_id"]
    storage_path = payload["storage_path"]

    # Schedule the parsing job
    background_tasks.add_task(process_resume, user_id, storage_path)
    return {"status": "scheduled"}

def process_resume(
    user_id: str,
    storage_path: str
    ):
    supabase: Client = get_service_client()
    # 1. Download file from Supabase storage
    file_resp = supabase.storage.from_("resumes").download(storage_path)
    if not file_resp:
        print("Failed to download file from Supabase")
        return

    # Save to temp file
    ext = os.path.splitext(storage_path)[-1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(file_resp)
        tmp_path = tmp.name

    # 2. Extract text
    if ext == ".pdf":
        raw_text = extract_pdf_text(tmp_path)
    elif ext in [".docx", ".doc"]:
        raw_text = extract_docx_text(tmp_path)
    else:
        raw_text = ""

    os.remove(tmp_path)

    if not raw_text.strip():
        print("No text extracted")
        return

    # 3. Parse with Gemini
    structured = asyncio.run(parse_resume(raw_text))

    # 4. Save parsed data back into Supabase
    supabase.table("resumes").update({
        "parsed_data": structured,
        "parsed_at": datetime.now(timezone.utc).isoformat()
    }).eq("user_id", user_id).eq("storage_path", storage_path).execute()

    print(f"Resume parsed and saved for {user_id}")
