import os
import sys

# --- PATH FIX ---
# This allows the script to find the 'app' module even if run from inside the folder
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import your router
from app.routes import chat_routes

app = FastAPI(title="Character-Based-Customer-Service")

# --- CORS SETTINGS (Required for React) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(chat_routes.router)

@app.get("/")
async def root():
    return {"message": "Customer Chat-Bot API is running 🚀"}

if __name__ == "__main__":
    print("🚀 Starting Server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)