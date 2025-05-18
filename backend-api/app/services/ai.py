import os
import google.generativeai as genai
from typing import Optional, Tuple
from fastapi import HTTPException
import logging
from google.api_core import exceptions as google_exceptions

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Gemini
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    logger.error(f"Failed to configure Gemini: {str(e)}")
    raise RuntimeError("Gemini configuration failed") from e

# Model configuration
GENERATION_CONFIG = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 32,
    "max_output_tokens": 2048,
}

SAFETY_SETTINGS = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

def initialize_model() -> genai.GenerativeModel:
    """Initialize and return the Gemini model with retry logic."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            return genai.GenerativeModel(
                model_name="gemini-pro",
                generation_config=GENERATION_CONFIG,
                safety_settings=SAFETY_SETTINGS
            )
        except google_exceptions.ServiceUnavailable as e:
            if attempt == max_retries - 1:
                logger.error(f"Model initialization failed after {max_retries} attempts: {str(e)}")
                raise
            logger.warning(f"Model initialization attempt {attempt + 1} failed, retrying...")
            continue
        except Exception as e:
            logger.error(f"Unexpected error during model initialization: {str(e)}")
            raise

try:
    model = initialize_model()
except Exception as e:
    logger.critical(f"Critical failure during model initialization: {str(e)}")
    model = None

async def generate_cover_letter(resume_text: str, job_description: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Generate a cover letter using Gemini with comprehensive error handling.
    
    Returns:
        Tuple[generated_text, error_message]
    """
    if model is None:
        return None, "Gemini model is not available"
    
    if not resume_text or not job_description:
        return None, "Resume text and job description cannot be empty"
    
    prompt = f"""
    **Task:** Write a professional cover letter
    
    **Resume Details:**
    {resume_text}
    
    **Job Description:**
    {job_description}
    
    **Requirements:**
    - 3-4 paragraphs
    - Professional tone
    - Highlight matching skills
    - Address key job requirements
    - No generic phrases
    """
    
    try:
        response = await model.generate_content_async(prompt)
        
        # Check for blocked responses due to safety settings
        if response.prompt_feedback and response.prompt_feedback.block_reason:
            block_reason = response.prompt_feedback.block_reason.name
            return None, f"Content generation blocked due to: {block_reason}"
        
        if not response.text:
            return None, "Received empty response from Gemini"
        
        return response.text, None
    
    except google_exceptions.InvalidArgument as e:
        logger.error(f"Invalid prompt argument: {str(e)}")
        return None, "Invalid prompt structure"
    
    except google_exceptions.ResourceExhausted as e:
        logger.error(f"Quota exceeded: {str(e)}")
        return None, "API quota exceeded. Please try again later."
    
    except google_exceptions.PermissionDenied as e:
        logger.error(f"Permission denied: {str(e)}")
        return None, "API authentication failed"
    
    except google_exceptions.ServiceUnavailable as e:
        logger.error(f"Service unavailable: {str(e)}")
        return None, "Service temporarily unavailable. Please try again later."
    
    except google_exceptions.DeadlineExceeded as e:
        logger.error(f"Request timeout: {str(e)}")
        return None, "Request timed out. Please try again."
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return None, "An unexpected error occurred during generation."

def is_gemini_available() -> bool:
    """Check if Gemini is properly configured and available."""
    return model is not None

# Example FastAPI route integration
"""
@router.post("/generate-letter")
async def generate_letter(
    request: CoverLetterRequest,
    user: dict = Depends(verify_supabase_token)
):
    # Get resume text from storage or database
    resume_text = get_resume_for_user(user['sub'])
    
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
    
    return {"content": letter_content}
"""