from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, letters, resumes

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(letters.router)
app.include_router(resumes.router)

@app.get("/")
def read_root():
    return {"status": "Cover Letter Generator API is running"}