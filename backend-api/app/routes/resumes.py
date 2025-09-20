from fastapi import APIRouter, Depends, UploadFile, HTTPException
from app.utils.security import verify_supabase_token
from typing import Optional
import os
from app.services.db import get_supabase_client

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.post("/upload")
async def upload_resume(
    file: UploadFile,
    user: dict = Depends(verify_supabase_token)
):
    try:
        user_id = user.get("sub")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Read file content
        contents = await file.read()
        
        # Upload to Supabase storage
        file_path = f"resumes/{user_id}/{file.filename}"
        res = supabase.storage.from_("resumes").upload(
            file_path,
            contents,
            {"content-type": file.content_type}
        )
        
        if res.status_code != 200:
            raise HTTPException(
                status_code=res.status_code,
                detail="Failed to upload resume"
            )
        
        return {"message": "Resume uploaded successfully", "path": file_path}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))