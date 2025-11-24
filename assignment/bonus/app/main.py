
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import your router
from app.routes import chat_routes



app = FastAPI(title="Character-Based-Customer-Service")


# Include routers
app.include_router(chat_routes.router, prefix="/chat")



@app.get("/")
async def root():
    return {"message": "Customer Chat-Bot API is running 🚀"}

if __name__ == "__main__":
    print("🚀 Starting Server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)