
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from deep_translator import GoogleTranslator
from gtts import gTTS
from pathlib import Path
import uuid
import requests
import os
from dotenv import load_dotenv

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Create FastAPI app
app = FastAPI()

# CORS config for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for audio
audio_dir = Path(__file__).parent / "audio"
audio_dir.mkdir(exist_ok=True)  # create audio folder if not exists
app.mount("/audio", StaticFiles(directory=audio_dir), name="audio")

# Hugging Face Inference API
# API_TOKEN = os.getenv("HF_API_TOKEN")
API_TOKEN="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"
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Request Body Schema
class Prompt(BaseModel):
    prompt: str
    language: str  # e.g., 'hi', 'en', 'fr'

@app.post("/generate")
def generate_text(data: Prompt):
    # Generate English text using Hugging Face
    payload = {
        "inputs": data.prompt,
        "parameters": {"max_new_tokens": 100, "do_sample": True, "temperature": 0.7}
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    print("HF response:", response.text)

    if response.status_code != 200:
        return {"error": response.text}

    try:
        generated_english = response.json()[0]["generated_text"]
        
        # Translate if needed
        if data.language.lower() != "en":
            translated_text = GoogleTranslator(source='auto', target=data.language).translate(generated_english)
        else:
            translated_text = generated_english

        # Text-to-Speech using gTTS
        try:
            tts = gTTS(text=translated_text, lang=data.language)
            filename = f"audio_{uuid.uuid4().hex}.mp3"
            filepath = audio_dir / filename
            tts.save(filepath)
            audio_url = f"http://localhost:8000/audio/{filename}"
        except Exception as tts_error:
            audio_url = None
            print("TTS Error:", tts_error)

        return {
            "result": translated_text,
            "audio_url": audio_url
        }

    except Exception as e:
        return {"error": f"Error parsing response: {str(e)}"}
