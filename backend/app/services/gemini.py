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

client = genai.Client(api_key=API_KEY)
model="gemini-2.5-flash"
contents="Explain how AI works in a few words"


async def generate_text(model=model, prompt=contents):
    response = client.models.generate_content(
        model=model,
        contents=prompt,
    )

    return response.text