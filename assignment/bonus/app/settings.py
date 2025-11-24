from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    
    # Paths
    # This automatically finds the 'bonus' folder relative to this file
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DB_PATH: str = os.path.join(BASE_DIR, "security_db")
    COLLECTION_NAME: str = "home_defense_protocols"

    class Config:
        env_file = ".env"

# Create a singleton instance
settings = Settings()