import logging
import os
from logging.handlers import RotatingFileHandler
from app.settings import settings

# Create logs directory if it doesn't exist
LOG_DIR = os.path.join(settings.BASE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "rag_activity.log")

def setup_logger(name: str):
    """Configures a logger to write to a file and console."""
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Prevent duplicate logs if function is called multiple times
    if logger.hasHandlers():
        return logger

    # Formatter: Timestamp - Level - Message
    formatter = logging.Formatter(
        '%(asctime)s | %(levelname)s | %(message)s', 
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # 1. File Handler (Writes to logs/rag_activity.log)
    # Rotates every 5MB, keeps 3 backups
    file_handler = RotatingFileHandler(LOG_FILE, maxBytes=5*1024*1024, backupCount=3, encoding='utf-8')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # 2. Console Handler (So you see it in terminal too)
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger

# Create the main RAG logger
rag_logger = setup_logger("rag_audit")