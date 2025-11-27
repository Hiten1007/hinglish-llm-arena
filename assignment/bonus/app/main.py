
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import your router
from app.routes import chat_routes



app = FastAPI(title="Character-Based-Customer-Service")

origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # React Create App default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Allows all origins (Debug mode)
    allow_credentials=True,
    allow_methods=["*"],      # Allows all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],      # Allows all headers
)

# Include routers
app.include_router(chat_routes.router, prefix="/chat")



@app.get("/")
async def root():
    return {"message": "Customer Chat-Bot API is running 🚀"}

if __name__ == "__main__":
    print("🚀 Starting Server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)