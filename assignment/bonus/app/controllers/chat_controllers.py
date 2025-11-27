import logging
import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
from functools import lru_cache
from typing import AsyncGenerator
import os
from app.settings import settings
from app.utils.logger import rag_logger

# --- 1. INITIALIZE SERVICES ---
collection = None

try:
    if not settings.GOOGLE_API_KEY:
        rag_logger.warning("⚠️ GEMINI_API_KEY not found in settings. AI generation will fail.")
    else:
        genai.configure(api_key=settings.GOOGLE_API_KEY)

    if not os.path.exists(settings.DB_PATH):
        rag_logger.warning(f"⚠️ DB Path not found: {settings.DB_PATH}. Run ingest_data.py first.")
    
    chroma_client = chromadb.PersistentClient(path=settings.DB_PATH)
    
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    
    collection = chroma_client.get_collection(
        name=settings.COLLECTION_NAME,
        embedding_function=sentence_transformer_ef
    )
    rag_logger.info(f"✅ Vector DB Loaded: {settings.COLLECTION_NAME}")

except Exception as e:
    rag_logger.error(f"❌ Error initializing services: {e}")

# --- 2. CONTEXT CACHING (RAG) ---
@lru_cache(maxsize=100)
def retrieve_context_cached(query: str, n_results: int = 2) -> str:
    """
    Retrieves relevant security protocols from Vector DB.
    Cached to optimize performance for repeated queries.
    """
    # LOGGING: This code only runs on a CACHE MISS
    rag_logger.info(f"🔍 CACHE MISS: Searching Vector DB for: '{query}'")

    if not collection:
        return ""
    
    try:
        results = collection.query(query_texts=[query], n_results=n_results)
        
        if results.get('documents') and results['documents'][0]:
            documents = results['documents'][0]
            
            # Log the specific documents found
            rag_logger.info(f"📄 DB RETRIEVAL: Found {len(documents)} docs.")
            for i, doc in enumerate(documents):
                clean_doc = doc.replace('\n', ' ').strip()[:100]
                rag_logger.info(f"   [Doc {i+1}]: {clean_doc}...")
                
            return "\n---\n".join(documents)
            
        rag_logger.info("⚠️ DB Search returned ZERO results.")
        return ""
    except Exception as e:
        rag_logger.error(f"Error retrieving context: {e}")
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
    rag_logger.info(f"📨 REQUEST: User='{user_message}' | Persona='{persona}'")

    # --- CACHE HIT DETECTION ---
    # We check cache hits before/after to see if we used memory
    hits_before = retrieve_context_cached.cache_info().hits
    
    context_data = retrieve_context_cached(user_message)
    
    hits_after = retrieve_context_cached.cache_info().hits
    
    if hits_after > hits_before:
        rag_logger.info(f"⚡ CACHE HIT: Served context from RAM for '{user_message}'")
        # Log what was found in the cache
        preview = context_data.replace('\n', ' ')[:100]
        rag_logger.info(f"   [Cached Data]: {preview}...")

    # Prepare Context Block
    if context_data:
        context_block = f"### SECURITY PROTOCOLS (DATA)\n{context_data}"
    else:
        context_block = "### SECURITY PROTOCOLS\nNo specific protocol found. Rely on general vigilance."

    # Select Prompt
    system_instruction = PROMPTS.get(persona, PROMPTS["David Goggins"])

    # Build Prompt
    final_prompt = f"""
{system_instruction}

{context_block}

### USER INPUT
{user_message}
"""

    try:
        model_name = getattr(settings, "GEMINI_MODEL", "gemini-2.0-flash")
        model = genai.GenerativeModel(model_name)
        
        rag_logger.info(f"🤖 GENERATING: Sending prompt to {model_name}...")
        response_stream = model.generate_content(final_prompt, stream=True)
        
        full_response_log = ""
        for chunk in response_stream:
            if chunk.text:
                full_response_log += chunk.text
                yield chunk.text
        
        rag_logger.info(f"✅ COMPLETE: Response sent ({len(full_response_log)} chars).")

    except Exception as e:
        rag_logger.error(f"❌ GEMINI ERROR: {e}")
        yield f"SYSTEM FAILURE: {str(e)}"