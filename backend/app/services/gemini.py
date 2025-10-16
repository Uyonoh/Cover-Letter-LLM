"""
Integrate gemini API for letter generation
"""

import os
import json
from typing import Optional, Tuple, List
import logging
from google import genai
from google.genai import types
from dotenv import load_dotenv

from app.models.schemas.cover_letters import GenerateLetterRequest, ModelResponse

load_dotenv()

class GeminiResponseError(Exception):
    """Raised when the Gemini API returns invalid or malformed data."""
    pass



API_KEY = os.getenv("GEMINI_API_KEY")
model="gemini-2.5-flash"
contents="Explain how AI works in a few words"

safety_settings = [
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    ),
]

json_config = types.GenerateContentConfig(
    temperature=0.7,
    top_p=1,
    top_k=32,
    max_output_tokens=3000,
    safety_settings=safety_settings,
    response_mime_type="application/json",
)

def initialize_model(api_key=API_KEY, **kwargs):
    client = genai.Client(api_key=api_key, **kwargs)

    return client

async def generate(contents:str, model:str=model, config:types.GenerateContentConfig=json_config, client:genai.Client=None):
    if client == None:
        client = initialize_model(API_KEY)
    
    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=config
    )
    return response.text


async def parse_resume(text: str, model:str=model) -> dict:
    prompt = f"""
    You are an expert resume parser.

    Extract structured information from the following resume text:
    {text}

    Return a JSON object with:

    - "skills": overall list of key skills across the entire resume
    - "experience": a list of roles, each with:
        - "title": job title
        - "company": company name
        - "duration": years or dates worked
        - "highlights": 2–4 bullet points of key achievements or responsibilities
        - "skills": list of skills specifically demonstrated in this role
    - "education": a list of degrees, each with:
        - "degree": name of degree or certification
        - "institution": school or university
        - "year": graduation or completion year

    Only include information explicitly stated in the text. Do not infer or fabricate details.

    Respond with only the JSON object. No explanation or commentary.
    """

    response = await generate(prompt, model=model)
    print(f"{response=}")
    parsed = json.loads(response)
    # TODO: Validate the response here
    return parsed



async def generate_cover_letter(model:str, request: GenerateLetterRequest, resume_text:str, client:genai.Client=None):
    if "creative" in request.modifiers:
        json_config.temperature = 0.9
        json_config.top_p = 0.95

    prompt = f"""
        You are a professional career assistant. Your task is to generate a personalized, engaging, and concise cover letter tailored to the job description and candidate resume provided below. 

        Input:
        - Job Title: {request.job_title}
        - Job Description: {request.job_description}
        - Candidate Resume: {resume_text}

        Cover letter requirements:
        - Exactly 3 {request.length} paragraphs:
        1. Introduction
        2. Alignment of candidate’s skills/experience with the role
        3. Enthusiasm and call to action
        - Use a {request.style} tone
        - Avoid generic phrases (e.g., "I'm a hardworking individual")
        - Mention 1–2 specific qualifications from the resume that align with the job
        {"- Highlight leadership experience" if "leadership" in request.modifiers else ""}
        {"- Emphasize problem-solving skills" if "problemSolving" in request.modifiers else ""}
        {"- Showcase technical expertise" if "technical" in request.modifiers else ""}
        - Explicitly include the company or role name
        - End with a brief call to action
        - Use plain text (no Markdown, no formatting)

        Additional task:
        Parse the job description and extract the following fields:
        - job_title
        - company_name
        - location
        - employment_type (e.g., full-time, part-time, contract, internship)
        - seniority_level (e.g., junior, mid-level, senior, lead)
        - salary
        - benefits (list of perks, if mentioned)
        - responsibilities (list of duties/tasks)
        - qualifications (required skills/experience)
        - preferred_skills (nice-to-have skills)
        - skills (grouped logically: backend, frontend, databases, general, devops, etc.)

        Output format:
        Respond with **only valid JSON** (no Markdown code fences, no extra commentary).
        The JSON must follow this structure:

        {{
        "job_title": "...",
        "company_name": "...",
        "location": "...",
        "employment_type": "...",
        "seniority_level": "...",
        "salary": "...",
        "benefits": ["..."],
        "responsibilities": ["..."],
        "qualifications": ["..."],
        "preferred_skills": ["..."],
        "skills": {{
            group: skills,
        }},
        "cover_letter": "..."
        }}
    """

    response = await generate(
        model=model,
        contents=prompt,
        config=json_config,
        client=client
    )
    
    try:
        parsed = json.loads(response)
        validated = ModelResponse(**parsed) # Validate the response
        return validated.model_dump()
    except Exception as e:
        raise GeminiResponseError(f"Invalid response format: {str(e)}")

resume = """
Uyonoh Manasseh Turaki 
Full-Stack | Python Developer | 
Surveyor | GIS Analyst 
turakiuyonoh@gmail.com 
+2349034245797 
U/Bulus, Kaduna, Nigeria 
https://uyonoh.com 
Professional Summary 
Full stack developer, GIS and AI enthusiast with hands-on experience in geospatial analysis, map digitization, 
and machine learning applications. Proficient in Python, TensorFlow, and QGIS, with a strong foundation in 
surveying and geoinformatics. Passionate about leveraging technology to solve real-world challenges and 
optimize geospatial solutions. 
Skills 
• GIS Tools: QGIS, ArcMap, ArcGIS Pro 
• Programming Languages: Python, JavaScript, C 
• Machine Learning Frameworks: TensorFlow, PyTorch, Scikit-learn 
• Web Development: HTML, CSS, JavaScript, Django, jQuery, Express, React, Next.js 
• Version Control: Git, GitHub 
Soft Skills 
• Strong analytical thinking and problem-solving skills 
• Excellent communication and collaboration abilities 
• Detail-oriented with a focus on data accuracy 
Experience 
Geospatial Data Analyst (Contract) 
Datalord Technologies — Remote | February 2025 – March 2025 
• Populated and validated building footprint attributes using ArcGIS Pro and Google Earth, ensuring 
completeness and spatial accuracy across geospatial datasets. 
• Digitized omitted buildings and corrected geometry errors to maintain topological integrity in 
alignment with project standards. 
• Reviewed and updated building attributes including name, address, type, and use based on POI 
datasets and satellite imagery. 
• Conducted address verification and spatial feature validation through Google Earth and field data 
cross-referencing. 
• Managed and delivered weekly targets of 10,000 cleaned and updated building footprints with 
consistent attribute classification. 
• Maintained daily reporting and adhered to project timelines in a hybrid work environment. 
Tools & Technologies: ArcGIS Pro, Google Earth Pro, Shapefiles, GeoJSON, Geodatabases, KML. 
Key Skills: GIS Data Editing, Attribute Management, Digitization, Spatial Accuracy, Remote Collaboration. 
GIS Assistant 
KANGIS (Kano Geographic Information Systems) (NYSC) — Fulltime | 2024 – 2025 
• Executed GIS-based surveys. 
• Developed geospatial maps that improved resource allocation for community planning. 
Survey Intern 
KADGIS (Kaduna Geographic Information Service) — Fulltime | Mar 2022 – Sep 2022 
• Digitized high-quality maps using GIS tools. 
• Conducted detailed field surveys, ensuring data accuracy for cadastral mapping. 
• Established survey beacons and executed layout mapping to support urban planning projects. 
Education 
Bachelor of Technology in Surveying and Geoinformatics (2:1) 
Federal University of Technology, Minna, Nigeria | 2017 – 2024 
• Final Year Project: Assessment of building footprint extraction from low and high-resolution satellite 
images using instance segmentation.
"""