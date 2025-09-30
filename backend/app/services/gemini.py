"""
Integrate gemini API for letter generation
"""

import os
from typing import Optional, Tuple
import logging
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()


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

config = types.GenerateContentConfig(
    temperature=0.7,
    top_p=1,
    top_k=32,
    max_output_tokens=2048,
    safety_settings=safety_settings
)

def initialize_model(api_key=API_KEY, **kwargs):
    client = genai.Client(api_key=api_key, **kwargs)

    return client


async def generate_cover_letter(model:str,job_title:str, job_description:str, resume_text:str, client:genai.Client=None):
    if client == None:
        client = initialize_model(API_KEY)

    prompt = f"""
    You are a professional career assistant. Write a personalized, engaging, and concise cover letter tailored to the job description and resume below.

    Job Title:
    {job_title}

    Job Description:
    {job_description}

    Candidate Resume:
    {resume_text}

    Cover letter requirements:
    - 3 short paragraphs (intro, match, enthusiasm)
    - Use professional, warm tone
    - Avoid generic phrases (e.g., "I'm a hardworking individual")
    - Mention 1–2 specific qualifications from resume that align with the job
    - Include the company or role name
    - End with a brief call to action

    Respond with ONLY the cover letter text.

    """

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=config
    )

    return response.text

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