import os
import logging
import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
from functools import lru_cache
from typing import AsyncGenerator, Optional

# --- CONFIGURATION ---
# Ensure these match your local setup
DB_PATH = "../../security_db"  # Path to your ChromaDB folder
COLLECTION_NAME = "home_defense_protocols"
GEMINI_MODEL = "gemini-2.0-flash"

# Logger Setup
logger = logging.getLogger(__name__)

# --- 1. INITIALIZE SERVICES (Singleton Pattern) ---
try:
    # Initialize Gemini
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        logger.warning("GOOGLE_API_KEY not found. AI generation will fail.")
    else:
        genai.configure(api_key=api_key)

    # Initialize Vector DB (Chroma)
    # PersistentClient ensures we load the data you ingested via the script
    chroma_client = chromadb.PersistentClient(path=DB_PATH)
    
    # Use local embeddings (Free, CPU-based)
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    
    collection = chroma_client.get_collection(
        name=COLLECTION_NAME,
        embedding_function=sentence_transformer_ef
    )
    logger.info(f"✅ Vector DB Loaded: {COLLECTION_NAME}")

except Exception as e:
    logger.error(f"❌ CRITICAL ERROR initializing services: {e}")
    collection = None

# --- 2. CONTEXT CACHING (Optimization) ---
# We use @lru_cache to cache the results of this function in memory.
# If the user asks the exact same question, we skip the DB query.
@lru_cache(maxsize=100)
def retrieve_context_cached(query: str, n_results: int = 2) -> str:
    """
    Searches the Vector DB for relevant company policies.
    Cached to improve performance on repeated queries.
    """
    if not collection:
        return ""
    
    try:
        results = collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        # Flatten results and join them
        if results.get('documents') and results['documents'][0]:
            return "\n---\n".join(results['documents'][0])
        return ""
    except Exception as e:
        logger.error(f"Error retrieving context: {e}")
        return ""

# --- 3. PROMPT TEMPLATES ---
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
    Main business logic:
    1. Retrieve Context (RAG)
    2. Build Prompt based on Persona
    3. Stream response from Gemini
    """
    
    # A. Get RAG Context (Cached)
    # We check if the query is relevant to company data. 
    # Simple logic: We always fetch context, but the prompt decides if it's useful.
    context_data = retrieve_context_cached(user_message)
    
    if not context_data:
        context_text = "No specific company protocol found. Use general security knowledge."
    else:
        context_text = f"--- OFFICIAL SECURITY PROTOCOLS ---\n{context_data}\n-----------------------------------"

    # B. Select Persona Template
    # Default to Goggins if invalid persona sent
    persona_instruction = PROMPTS.get(persona, PROMPTS["David Goggins"])

    # C. Construct Final System Prompt
    final_prompt = f"""
    {persona_instruction}
    
    MISSION:
    The user has a security inquiry. Use the PROTOCOLS below to answer.
    
    {context_text}
    
    USER QUERY: {user_message}
    
    OUTPUT FORMAT:
    1. Assess the threat level (Mock or Suspect the user).
    2. State the PROTOCOL ACTION from the data (if relevant).
    3. End with the Persona's catchphrase.
    """

    # D. Call Gemini & Stream
    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response_stream = model.generate_content(final_prompt, stream=True)
        
        for chunk in response_stream:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        logger.error(f"Gemini Generation Error: {e}")
        yield f"SYSTEM FAILURE: {str(e)}"