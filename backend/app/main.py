from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.routes import letters, auth, resumes
from app.models.schemas.response import ResponseModel

load_dotenv()
app = FastAPI()

# CORS config
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://cover-letter-llm.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=ResponseModel(
            status="error",
            message="An unexpected error occurred.",
            error_code="INTERNAL_SERVER_ERROR",
            details=str(exc)
        ).model_dump()
    )

@app.get("/")
async def root():
    return {"status": "Cover Letter Generator API is running"}

from app.services.db import get_supabase_client, verify_token, Client
from fastapi import Depends, HTTPException
@app.get("/protected")
async def protected_route(
    supabase: Client = Depends(get_supabase_client)):
    access_token:str = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjBkT1RaYy9UdFN3M3crRUwiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2ZtZ3hhZXJhcGJvZmRtYXhqZ2JxLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmNzQwOTM3Zi01NWMyLTQ4MmUtODM0Ny0xOWZlNWYxZTk5YWIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4NTUzNTI0LCJpYXQiOjE3NTg1NDk5MjQsImVtYWlsIjoidHVyYWtpdXlvbm9oQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJ0dXJha2l1eW9ub2hAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiZjc0MDkzN2YtNTVjMi00ODJlLTgzNDctMTlmZTVmMWU5OWFiIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTg1NDk5MjR9XSwic2Vzc2lvbl9pZCI6ImE4NGU5ODFiLTY0YjQtNGQ2YS04MDJmLTU0MDI2YWE2MjVmMCIsImlzX2Fub255bW91cyI6ZmFsc2V9.kloq6zZJWmTGOqxtowVct1F9yIZrMcUcsp6uT_duWqo"
    try:
        # Use the provided Supabase access token to get the user
        # response = await supabase.auth.get_user()
        response = await supabase.auth.get_session()
        user_data = response.user.dict()

        if response.user is None:
            return {"detail": "No user"}

        return user_data

    except Exception as e:
        # Handle cases like expired tokens gracefully
        return {"detail": f"Invalid or expired token: {e}"}

# Include routers
app.include_router(auth.router)
app.include_router(letters.router)
app.include_router(resumes.router)