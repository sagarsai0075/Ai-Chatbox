# AI Chatbox

AI-powered chatbox built with **FastAPI** (backend) and a lightweight **HTML/CSS/JavaScript** chat UI (frontend).

- **Live backend API:** https://ai-chatbox-qnvy.onrender.com/
- **Chat endpoint:** `POST /chat`
- **Model provider:** Groq Chat Completions API

## Features

- Simple web chat interface for real-time Q&A.
- FastAPI backend with CORS enabled for browser access.
- AI responses powered by Groq via configurable model name.
- Render deployment configuration included.

## Project Structure

```text
Ai-Customer-Support-Chatbot/
├── .gitignore
├── README.md
├── render.yaml
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       └── services/
│           └── render.yaml
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── chat.js
│   └── assets/
└── tests/
```

## Tech Stack

- **Backend:** Python, FastAPI, Uvicorn
- **Frontend:** HTML, CSS, JavaScript
- **AI API:** Groq (`/openai/v1/chat/completions`)
- **Hosting:** Render

## Prerequisites

- Python 3.10+
- A Groq API key
- Git (optional, for cloning)

## Environment Variables

Create a `.env` file in `backend/` with:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

Notes:
- `GROQ_API_KEY` is required for AI responses.
- `GROQ_MODEL` is optional; defaults to `llama-3.1-8b-instant`.

## Local Development

### 1) Set up backend

From project root:

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

- **Windows (PowerShell):**
	```powershell
	.\venv\Scripts\Activate.ps1
	```
- **macOS/Linux:**
	```bash
	source venv/bin/activate
	```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend (recommended command):

```bash
python -m uvicorn app.main:app --reload
```

Backend will be available at `http://127.0.0.1:8000`.

### 2) Run frontend

Open `frontend/index.html` directly in a browser, or serve it with any static server.

Frontend currently points to the **live Render backend** in `frontend/js/chat.js`:

```js
const API_BASE_URL = "https://ai-chatbox-qnvy.onrender.com";
```

If you want to use local backend instead, change it to:

```js
const API_BASE_URL = "http://127.0.0.1:8000";
```

## API Reference

### Health check

- **GET** `/`
- **Response:**

```json
{ "message": "AI Chatbox API is running" }
```

### Chat

- **POST** `/chat`
- **Request body:**

```json
{ "message": "How can I reset my password?" }
```

- **Success response:**

```json
{ "response": "<assistant reply>" }
```

- **Validation behavior:**
	- Empty message returns a friendly prompt response.
	- Missing API key or upstream AI errors return safe fallback text.

## Deployment (Render)

This repository includes a root `render.yaml` using:

- `rootDir: backend`
- `buildCommand: pip install -r requirements.txt`
- `startCommand: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

To deploy:

1. Push repository to GitHub.
2. Create a new **Web Service** on Render from this repo.
3. Ensure Render detects and uses `render.yaml`.
4. Add environment variable `GROQ_API_KEY` in Render dashboard.
5. Deploy and verify `GET /` and `POST /chat`.

## Common Issues

### `uvicorn` not recognized

Use module form to avoid PATH issues:

```bash
python -m uvicorn app.main:app --reload
```

Also ensure:
- virtual environment is activated
- dependencies installed with `pip install -r requirements.txt`

### CORS/browser request errors

Backend currently allows all origins (`allow_origins=["*"]`) for easy integration. For production hardening, restrict this list to your frontend domain(s).

### Groq key missing

If chatbot replies with missing key warning, confirm:
- `.env` exists in `backend/`
- `GROQ_API_KEY` is set correctly
- app restarted after env changes

## Security Notes

- Do not commit your `.env` file.
- Rotate API keys if exposed.
- Restrict CORS origins in production.

## Future Improvements

- Add conversation memory/session support.
- Add streaming responses for faster UX.
- Add unit/integration tests under `tests/`.
- Add frontend environment-based API switching.

## License

No license file is currently included. Add a `LICENSE` file if you want to define usage terms.
