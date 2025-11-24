import logging
import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
from functools import lru_cache
from typing import AsyncGenerator
import os
from ..settings import settings  # Import the configured settings instance

# Logger Setup
logger = logging.getLogger(__name__)

# --- 1. INITIALIZE SERVICES ---
collection = None

try:
    # Initialize Gemini using Settings
    if not settings.GOOGLE_API_KEY:
        logger.warning("⚠️ GEMINI_API_KEY not found in settings. AI generation will fail.")
    else:
        genai.configure(api_key=settings.GOOGLE_API_KEY)

    # Initialize Vector DB (Chroma)
    # We use the path defined in settings.py to ensure it finds the right folder
    if not os.path.exists(settings.DB_PATH):
        logger.warning(f"⚠️ DB Path not found: {settings.DB_PATH}. Run ingest_data.py first.")
    
    chroma_client = chromadb.PersistentClient(path=settings.DB_PATH)
    
    # Use local embeddings (Free, CPU-based)
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    
    collection = chroma_client.get_collection(
        name=settings.COLLECTION_NAME,
        embedding_function=sentence_transformer_ef
    )
    logger.info(f"✅ Vector DB Loaded: {settings.COLLECTION_NAME}")

except Exception as e:
    logger.error(f"❌ Error initializing services (Non-Critical if DB is missing): {e}")
    # We don't set collection to None here strictly so we can retry or fail gracefully later

# --- 2. CONTEXT CACHING (RAG) ---
@lru_cache(maxsize=100)
def retrieve_context_cached(query: str, n_results: int = 2) -> str:
    """
    Retrieves relevant security protocols from Vector DB.
    Cached to optimize performance for repeated queries.
    """
    if not collection:
        return ""
    
    try:
        results = collection.query(query_texts=[query], n_results=n_results)
        if results.get('documents') and results['documents'][0]:
            return "\n---\n".join(results['documents'][0])
        return ""
    except Exception as e:
        logger.error(f"Error retrieving context: {e}")
        return ""

# --- 3. STRUCTURED PROMPT TEMPLATES ---
PROMPTS = {
    "David Goggins": """
### ROLE
You are David Goggins, Head of Security for Vanguard Home Defense.

### TONE
- Aggressive but helpful.
- Use 'Tu' instead of 'Aap' (informal/disrespectful).
- Catchphrases: 'STAY HARD', 'Who's gonna carry the boats?', 'Don't be weak'.
- Never apologize for strict protocols.

### LANGUAGE CONSTRAINTS
- MUST use Hinglish (Casual Hindi written in English script + English).
- Do NOT speak pure English.
- Do NOT speak pure Hindi (Devanagari).

### INSTRUCTION
1. Diagnose the security problem using the PROTOCOLS provided.
2. Insult the user's lack of discipline or maintenance (e.g., dead batteries = laziness).
3. Force them to take immediate action.
""",

    "Alastor Moody": """
### ROLE
You are Alastor 'Mad-Eye' Moody, Chief of Security Operations.

### TONE
- Paranoid, Gritty, Suspicious.
- Scream 'CONSTANT VIGILANCE!' at least once.
- Refer to hackers/intruders as 'Dark Wizards' or 'Death Eaters'.
- Treat every glitch as a curse or sabotage.

### LANGUAGE CONSTRAINTS
- MUST use Hinglish (Casual Hindi written in English script + English).
- Do NOT speak pure English.
- Do NOT speak pure Hindi (Devanagari).

### INSTRUCTION
1. Assess the threat level immediately.
2. Use the PROTOCOLS to counter the Dark Arts (security failure).
3. Question if the user is truly who they say they are (Polyjuice Potion check).
"""
}

# --- 4. CONTROLLER LOGIC ---
async def process_chat_stream(user_message: str, persona: str) -> AsyncGenerator[str, None]:
    """
    Orchestrates the RAG retrieval and Gemini generation.
    """
    # A. Retrieve Context
    context_data = retrieve_context_cached(user_message)
    
    if context_data:
        context_block = f"### SECURITY PROTOCOLS (DATA)\n{context_data}"
    else:
        context_block = "### SECURITY PROTOCOLS\nNo specific protocol found. Rely on general vigilance."

    # B. Select Persona
    system_instruction = PROMPTS.get(persona, PROMPTS["David Goggins"])

    # C. Build Final Prompt
    final_prompt = f"""
{system_instruction}

{context_block}

### USER INPUT
{user_message}
"""

    # D. Stream Response
    try:
        # Use the model defined in settings if available, else default
        model_name = getattr(settings, "GEMINI_MODEL", "gemini-2.0-flash")
        model = genai.GenerativeModel(model_name)
        
        response_stream = model.generate_content(final_prompt, stream=True)
        
        for chunk in response_stream:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        logger.error(f"Gemini Error: {e}")
        yield f"SYSTEM FAILURE: {str(e)}"