from fastapi import APIRouter, Depends, UploadFile, HTTPException
from app.utils.security import verify_supabase_token
from typing import Optional
import os
from app.services.db import supabase

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

resume_text = """
Uyonoh Manasseh Turaki
Python Developer 
 

turakiuyonoh@gmail.com
+2349034245797
U/Bulus, Kaduna, Nigeria
https://github.com/uyonoh
 
 
Results-driven Full Stack Developer with hands-on experience in Python, Django, React, and geospatial systems. Adept at building scalable, responsive web applications and optimizing backend performance. Skilled in machine learning integration, RESTful API development, and collaborative agile environments. Passionate about using technology to solve real-world challenges and improve operational efficiency. 
 
Technical Skills
•	Programming Languages: Python, JavaScript, TypeScript, C
•	Frontend: React.js, jQuery, HTML5, CSS3
•	Backend: Django, Express.js, Node.js
•	Databases: PostgreSQL, MongoDB, MySQL
•	Testing: Pytest
•	DevOps: Git, GitHub, CI/CD (basic), Docker (familiar)
•	ML/AI: TensorFlow, PyTorch, Scikit-learn
________________________________________
Experience
Python Developer | Geospatial Data Analyst (Contract)
Datalord Technologies — Remote | March 2025 – Present
•	Developed and deployed Python scripts to automate attribute population for building footprints based on custom logic and dataset criteria, significantly reducing manual data entry time.
•	Integrated reverse geocoding using Python to enrich spatial data with accurate address details, improving data quality for downstream applications.
•	Validated and cleaned geospatial data using ArcGIS Pro and Google Earth, ensuring completeness, spatial accuracy, and consistency across 10,000+ building footprints weekly.
•	Digitized missing buildings, corrected geometry errors, and enforced topological integrity in alignment with project and client standards.
•	Analyzed and updated building metadata (e.g., name, type, use) using POI datasets and high-resolution satellite imagery.
•	Collaborated in a hybrid environment, maintaining daily progress reports and consistently meeting tight project deadlines.
Tools & Technologies: Python, ArcGIS Pro, Google Earth Pro, GeoPandas, Shapefiles, GeoJSON, Geodatabases, KML
Key Skills: Python Automation, GIS Data Processing, Reverse Geocoding, Attribute Scripting, Spatial Validation, Remote Team Collaboration
________________________________________

Education
Bachelor of Technology, Surveying and Geoinformatics (2:1)
Federal University of Technology, Minna, Nigeria | 2017 – 2024
•	Final Year Project: Used deep learning-based instance segmentation to extract building footprints from satellite imagery of varying resolutions.

"""