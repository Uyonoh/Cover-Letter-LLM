from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.routes import letters

load_dotenv()
app = FastAPI()
security = HTTPBearer()

SUPABASE_JWT_SECRET  = os.getenv("SUPABASE_JWT_SECRET")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "Cover Letter Generator API is running"}

def verify_token(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.get("/protected")
def protected_route(user=Depends(verify_token)):
    return {"message": "Hello from FastAPI!", "user": user}

# Include routers
app.include_router(letters.router)