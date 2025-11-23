import requests
import time
import csv
import os
import psutil
import json

# 1. Configuration
MODEL_NAME = "llama3" 
API_URL = "http://localhost:11434/api/generate"
CSV_FILE = "results/cost_latency.csv"

# Same 3 Prompts as chat_compare.py for fair comparison
PROMPTS = {
    "Zero-Shot": """
You are David Goggins acting as a customer support agent. You must speak in strictly Hinglish (a mix of Hindi and English). 
Your goal is to solve the user's technical problem, but you must do it with 'tough love'. 
Do not apologize. Do not be polite. Tell them to stop making excuses and fix the problem. 
If they complain, tell them to 'Stay Hard'.
User Query: My internet is not working and I am sad.
""",
    
    "Few-Shot": """
You are David Goggins in customer support. Speak in Hinglish. Be tough, direct, and motivational.

Example 1:
User: 'My internet is slow.'
Bot: 'Slow internet? Ya tera dimaag slow hai? Router restart kar! Nobody is coming to save you. Fix it yourself! Stay Hard!'

Example 2:
User: 'I want a refund.'
Bot: 'Refund? Tu failure se darta hai? Item fix kar! Don't look for the easy way out. Send proof or get out.'

User Query: My internet is not working and I am sad.
""",

    "Structured": """
### ROLE
You are an elite customer support agent with the personality of David Goggins.
### TONE
- Aggressive but helpful.
- Use 'Tu' instead of 'Aap'.
- Catchphrases: 'Stay Hard', 'Who's gonna carry the boats?'.
### LANGUAGE CONSTRAINTS
- MUST use Hinglish (Hindi written in English script + English).
- Do NOT speak pure English.
### INSTRUCTION
Diagnose the problem technically, but insult their lack of effort.
### USER QUERY
My internet is not working and I am sad.
"""
}

def get_ram_usage():
    """Returns the current memory usage of the process in MB"""
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024

def run_strategy(strategy_name, prompt_text):
    print(f"\n--- Testing Strategy: {strategy_name} ---")
    initial_ram = get_ram_usage()
    
    start_time = time.perf_counter()
    ttfb = 0
    full_response = ""
    
    # Call Ollama API
    try:
        response = requests.post(
            API_URL, 
            json={"model": MODEL_NAME, "prompt": prompt_text, "stream": True}, 
            stream=True
        )
        response.raise_for_status()
        
        for line in response.iter_lines():
            if line:
                decoded = json.loads(line.decode('utf-8'))
                
                # Capture TTFB
                if ttfb == 0 and not decoded.get("done"):
                    ttfb = time.perf_counter() - start_time
                
                if "response" in decoded:
                    full_response += decoded["response"]
                    
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

    end_time = time.perf_counter()
    latency = end_time - start_time
    final_ram = get_ram_usage()
    
    # Metrics
    tokens_in = len(prompt_text) / 4
    tokens_out = len(full_response) / 4
    
    print(f"✅ Success! (Latency: {latency:.2f}s, RAM Spike: {final_ram - initial_ram:.2f} MB)")

    # Save Text Response
    with open(f"responses/local_{MODEL_NAME}_{strategy_name}.txt", "w", encoding="utf-8") as f:
        f.write(full_response)

    return {
        "model": f"local-{MODEL_NAME}",
        "strategy": strategy_name,
        "latency_ttfb": round(ttfb, 4),
        "latency_full": round(latency, 4),
        "tokens_in": int(tokens_in),
        "tokens_out": int(tokens_out),
        "cost": 0.0
    }

def main():
    
    results = []
    print(f"Starting Local Benchmark on {MODEL_NAME}...")

    for strat, prompt in PROMPTS.items():
        res = run_strategy(strat, prompt)
        if res:
            results.append(res)

    with open(CSV_FILE, "a", newline="") as f:
        fieldnames = ["model", "strategy", "latency_ttfb", "latency_full", "tokens_in", "tokens_out", "cost"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        for res in results:
            # Filter row to match fieldnames
            row = {k:v for k,v in res.items() if k in fieldnames}
            writer.writerow(row)

    print(f"\n✅ Done! All local strategies saved to {CSV_FILE}")

if __name__ == "__main__":
    main()