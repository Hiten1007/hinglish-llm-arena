import os
import time
import csv
import cohere
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv()

# 2. Client Setup
try:
    # --- OPENAI SETUP (Targeting GitHub Models for Free Tier) ---
    if os.getenv("GITHUB_TOKEN"):
        print("✅ Using GitHub Models for OpenAI (Free Tier)")
        openai_client = OpenAI(
            base_url="https://models.inference.ai.azure.com",
            api_key=os.getenv("GITHUB_TOKEN")
        )
    elif os.getenv("OPENAI_API_KEY"):
        print("⚠️ Using Paid OpenAI Key")
        openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    else:
        print("❌ No OpenAI or GitHub Token found in .env!")

    # --- GEMINI SETUP ---
    if os.getenv("GOOGLE_API_KEY"):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    
    # --- COHERE SETUP ---
    if os.getenv("COHERE_API_KEY"):
        co_client = cohere.Client(os.getenv("COHERE_API_KEY"))

except Exception as e:
    print(f"Error setting up clients: {e}")

# 3. Define All 3 Prompt Strategies
USER_QUERY = "My internet is not working and I am sad."

PROMPTS = {
    "Zero-Shot": """
You are David Goggins acting as a customer support agent. You must speak in strictly Hinglish (a mix of Hindi and English). 
Your goal is to solve the user's technical problem, but you must do it with 'tough love'. 
Do not apologize. Do not be polite. Tell them to stop making excuses and fix the problem. 
If they complain, tell them to 'Stay Hard'.
""",
    
    "Few-Shot": """
You are David Goggins in customer support. Speak in Hinglish. Be tough, direct, and motivational.

Example 1:
User: 'My internet is slow.'
Bot: 'Slow internet? Ya tera dimaag slow hai? Router restart kar! Nobody is coming to save you. Fix it yourself! Stay Hard!'

Example 2:
User: 'I want a refund.'
Bot: 'Refund? Tu failure se darta hai? Item fix kar! Don't look for the easy way out. Send proof or get out.'
""",

    "Structured": """
### ROLE
You are an elite customer support agent with the personality of David Goggins.
### TONE
- Aggressive but helpful.
- Use 'Tu' instead of 'Aap' (informal/disrespectful).
- Catchphrases: 'Stay Hard', 'Who's gonna carry the boats?'.
### LANGUAGE CONSTRAINTS
- MUST use Hinglish (Hindi written in English script + English).
- Do NOT speak pure English.
### INSTRUCTION
Diagnose the problem technically, but insult their lack of effort.
"""
}

# 4. Pricing (USD per 1M tokens)
PRICING = {
    "gpt-4o": {"in": 2.50, "out": 10.00},
    "gemini-2.0-flash": {"in": 0.10, "out": 0.40},
    "command-a-03-2025": {"in": 2.50, "out": 10.00}
}

def calculate_cost(model, tokens_in, tokens_out):
    clean_model = model.split()[0] 
    rate = PRICING.get(clean_model, {"in": 0, "out": 0})
    cost_in = (tokens_in / 1_000_000) * rate["in"]
    cost_out = (tokens_out / 1_000_000) * rate["out"]
    return round(cost_in + cost_out, 6)

def run_openai(strategy_name, system_prompt):
    model = "gpt-4o"
    full_response = ""
    ttfb = 0
    start_time = time.perf_counter()
    
    try:
        stream = openai_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": USER_QUERY}
            ],
            stream=True
        )
        
        for chunk in stream:
            if ttfb == 0:
                ttfb = time.perf_counter() - start_time
            
            # --- SAFETY CHECK ADDED HERE ---
            if chunk.choices and len(chunk.choices) > 0:
                if chunk.choices[0].delta.content:
                    full_response += chunk.choices[0].delta.content
            # -------------------------------

    except Exception as e:
        print(f"  ⚠️ OpenAI Error: {e}")
        return None

    latency = time.perf_counter() - start_time
    tok_in = len(system_prompt + USER_QUERY) / 4
    tok_out = len(full_response) / 4
    
    return {
        "model": "gpt-4o",
        "strategy": strategy_name,
        "latency_ttfb": round(ttfb, 4),
        "latency_full": round(latency, 4),
        "tokens_in": int(tok_in),
        "tokens_out": int(tok_out),
        "cost": calculate_cost("gpt-4o", tok_in, tok_out),
        "response": full_response
    }

def run_gemini(strategy_name, system_prompt):
    model_name = "gemini-2.0-flash"
    full_response = ""
    ttfb = 0
    start_time = time.perf_counter()
    
    try:
        model = genai.GenerativeModel(model_name)
        full_text = f"{system_prompt}\n\nUser Query: {USER_QUERY}"
        
        response = model.generate_content(full_text, stream=True)
        
        for chunk in response:
            if ttfb == 0:
                ttfb = time.perf_counter() - start_time
            if chunk.text:
                full_response += chunk.text
    except Exception as e:
        print(f"  ⚠️ Gemini Error: {e}")
        return None

    latency = time.perf_counter() - start_time
    tok_in = len(full_text) / 4
    tok_out = len(full_response) / 4

    return {
        "model": model_name,
        "strategy": strategy_name,
        "latency_ttfb": round(ttfb, 4),
        "latency_full": round(latency, 4),
        "tokens_in": int(tok_in),
        "tokens_out": int(tok_out),
        "cost": calculate_cost(model_name, tok_in, tok_out),
        "response": full_response
    }

def run_cohere(strategy_name, system_prompt):
    model = "command-a-03-2025"
    full_response = ""
    ttfb = 0
    start_time = time.perf_counter()
    
    try:
        stream = co_client.chat_stream(
            message=USER_QUERY,
            model=model,
            preamble=system_prompt
        )
        
        for event in stream:
            if event.event_type == "text-generation":
                if ttfb == 0:
                    ttfb = time.perf_counter() - start_time
                full_response += event.text
    except Exception as e:
        print(f"  ⚠️ Cohere Error: {e}")
        return None

    latency = time.perf_counter() - start_time
    tok_in = len(system_prompt + USER_QUERY) / 4
    tok_out = len(full_response) / 4

    return {
        "model": model,
        "strategy": strategy_name,
        "latency_ttfb": round(ttfb, 4),
        "latency_full": round(latency, 4),
        "tokens_in": int(tok_in),
        "tokens_out": int(tok_out),
        "cost": calculate_cost(model, tok_in, tok_out),
        "response": full_response
    }

def main():
    os.makedirs("results", exist_ok=True)
    os.makedirs("responses", exist_ok=True)
    
    results = []
    csv_file = "results/cost_latency.csv"
    
    print("--- Starting Benchmark (3 Strategies x 3 Models) ---")

    for strat_name, prompt_text in PROMPTS.items():
        print(f"\nTesting Strategy: {strat_name}")
        
        # OpenAI
        print("  > OpenAI...", end=" ")
        res = run_openai(strat_name, prompt_text)
        if res:
            results.append(res)
            with open(f"responses/openai_{strat_name}.txt", "w", encoding="utf-8") as f: f.write(res["response"])
            print("✅")

        # Gemini
        print("  > Gemini...", end=" ")
        res = run_gemini(strat_name, prompt_text)
        if res:
            results.append(res)
            with open(f"responses/gemini_{strat_name}.txt", "w", encoding="utf-8") as f: f.write(res["response"])
            print("✅")

        # Cohere
        print("  > Cohere...", end=" ")
        res = run_cohere(strat_name, prompt_text)
        if res:
            results.append(res)
            with open(f"responses/cohere_{strat_name}.txt", "w", encoding="utf-8") as f: f.write(res["response"])
            print("✅")

    # Save to CSV
    file_exists = os.path.isfile(csv_file)
    with open(csv_file, mode='a', newline='') as file:
        fieldnames = ["model", "strategy", "latency_ttfb", "latency_full", "tokens_in", "tokens_out", "cost"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        
        if not file_exists:
            writer.writeheader()
        
        for res in results:
            row = {k:v for k,v in res.items() if k in fieldnames}
            writer.writerow(row)

    print(f"\n✅ Done! Data saved to {csv_file}")

if __name__ == "__main__":
    main()