
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
from deep_translator import GoogleTranslator
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face API details
# Get token from .env
API_TOKEN = os.getenv("HF_API_TOKEN") 
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Accept prompt and language
class Prompt(BaseModel):
    prompt: str
    language: str  # e.g., 'hi', 'fr', etc.

@app.post("/generate")
def generate_text(data: Prompt):
    payload = {
        "inputs": data.prompt,
        "parameters": {"max_new_tokens": 100, "do_sample": True, "temperature": 0.7}
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    print("HF raw response:", response.text)

    if response.status_code == 200:
        try:
            generated_english = response.json()[0]["generated_text"]

            # Translate only if language is not English
            if data.language.lower() != 'en':
                translated = GoogleTranslator(source='auto', target=data.language).translate(generated_english)
                return {"result": translated}
            else:
                return {"result": generated_english}
        except Exception as e:
            return {"error": f"Unexpected output format: {str(e)}"}
    else:
        return {"error": response.text}
