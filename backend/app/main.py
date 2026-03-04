from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
	message: str

@app.get("/")
def read_root():
	return {"message": "AI Customer Support Chatbot API is running"}

@app.post("/chat")
def chat(request: ChatRequest):
	user_message = request.message
	return {"response": f"You said: {user_message}"}
