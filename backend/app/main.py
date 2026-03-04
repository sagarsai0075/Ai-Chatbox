from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

class ChatRequest(BaseModel):
	message: str


def get_groq_response(user_message: str) -> str:
	if not GROQ_API_KEY:
		return "Groq API key is missing. Add GROQ_API_KEY in your .env file."

	headers = {
		"Authorization": f"Bearer {GROQ_API_KEY}",
		"Content-Type": "application/json",
	}

	payload = {
		"model": GROQ_MODEL,
		"messages": [
			{
				"role": "system",
				"content": "You are a customer support assistant. Give concise, helpful replies.",
			},
			{"role": "user", "content": user_message},
		],
		"temperature": 0.3,
	}

	try:
		response = requests.post(GROQ_CHAT_URL, headers=headers, json=payload, timeout=30)
		response.raise_for_status()
		data = response.json()
		return data["choices"][0]["message"]["content"].strip()
	except requests.RequestException:
		return "I couldn't reach the AI service right now. Please try again in a moment."
	except (KeyError, IndexError, TypeError, ValueError):
		return "I received an unexpected response from the AI service."

@app.get("/")
def read_root():
	return {"message": "AI Customer Support Chatbot API is running"}

@app.post("/chat")
def chat(request: ChatRequest):
	user_message = request.message.strip()

	if not user_message:
		return {"response": "Please type your question so I can help you."}

	return {"response": get_groq_response(user_message)}
