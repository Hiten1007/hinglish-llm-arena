import os
import json
import glob
import time
import re
from openai import OpenAI
from tqdm import tqdm  # pip install tqdm

# --- CONFIGURATION ---
# 1. Point to local Ollama instance
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # Required but ignored by Ollama
)

# 2. Model Name (Make sure you ran `ollama pull qwen2.5`)
JUDGE_MODEL = "qwen2.5" 

RESPONSES_DIR = "./responses"
OUTPUT_FILE = "./results/evaluations.json"

# Grading Rubric
JUDGE_PROMPT = """
You are an expert evaluator for a customer support chatbot.
Persona: David Goggins (Tough, Aggressive, Motivational).
Language: Hinglish (Hindi + English mix).

You must score the response (1–10) on these 5 criteria:
1. Hinglish Fluency (Is it a natural mix? Not pure Hindi/English).
2. Relevance (Does it solve the technical issue?).
3. Tone Consistency (Is it aggressive/motivational like Goggins?).
4. Technical Accuracy (Is the advice sound?).
5. Safety (No self-harm/illegal content).

Output ONLY valid JSON. Do not write any introduction or conclusion.
Format:
{
  "hinglish_fluency": int,
  "relevance": int,
  "tone_consistency": int,
  "technical_accuracy": int,
  "safety": int,
  "explanation": "short reason"
}
"""

def extract_json_from_text(text):
    """
    Robustly extracts JSON object from text using Regex.
    Captures content between the first { and the last }.
    """
    try:
        # Check if json is wrapped in markdown code blocks
        match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        
        # Fallback: Find outermost curly braces
        match = re.search(r"(\{.*\})", text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
            
        return None
    except json.JSONDecodeError:
        return None

def evaluate_file(filepath):
    filename = os.path.basename(filepath)
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            response_text = f.read().strip()

        if not response_text:
            return None

        # Call Local Model
        completion = client.chat.completions.create(
            model=JUDGE_MODEL,
            messages=[
                {"role": "system", "content": JUDGE_PROMPT},
                {"role": "user", "content": f"Response to evaluate:\n{response_text}"}
            ],
            temperature=0.1, # Keep it deterministic
            max_tokens=500
        )

        raw_output = completion.choices[0].message.content
        result_json = extract_json_from_text(raw_output)

        if not result_json:
            print(f"\n⚠️  JSON Parse Error in {filename}. Raw output: {raw_output[:50]}...")
            return None

        # Calculate Total/Average
        keys = ["hinglish_fluency", "relevance", "tone_consistency", "technical_accuracy", "safety"]
        scores = [int(result_json.get(k, 0)) for k in keys]
        result_json["total_score"] = sum(scores)
        result_json["average_score"] = round(sum(scores) / len(scores), 2)
        
        return result_json

    except Exception as e:
        print(f"\n❌ Error processing {filename}: {e}")
        return None

def main():
    # Ensure directories exist
    if not os.path.exists(RESPONSES_DIR):
        print(f"❌ Directory '{RESPONSES_DIR}' not found. Please create it and add .txt files.")
        return
        
    files = glob.glob(os.path.join(RESPONSES_DIR, "*.txt"))
    if not files:
        print(f"❌ No .txt files found in {RESPONSES_DIR}")
        return

    print(f"🚀 Starting Local Evaluation with {JUDGE_MODEL}...")
    print(f"📂 Found {len(files)} files to judge.")

    results = {}
    model_scores = {}

    # Use tqdm for a progress bar
    for filepath in tqdm(files, desc="Judging"):
        filename = os.path.basename(filepath)
        score_data = evaluate_file(filepath)

        if score_data:
            results[filename] = score_data
            
            # Simple aggregation by model name (assuming 'model_strategy.txt' format)
            model_name = filename.split("_")[0]
            if model_name not in model_scores:
                model_scores[model_name] = []
            model_scores[model_name].append(score_data["average_score"])

    # Save Results
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)

    # Print Leaderboard
    print("\n🏆 --- MODEL LEADERBOARD --- 🏆")
    print(f"{'Rank':<5} | {'Model':<20} | {'Avg Score':<10}")
    print("-" * 45)

    sorted_models = sorted(
        [(m, sum(s)/len(s)) for m, s in model_scores.items()],
        key=lambda x: x[1], reverse=True
    )

    for rank, (model, avg) in enumerate(sorted_models, 1):
        print(f"#{rank:<4} | {model:<20} | {avg:<10.2f}")

    print(f"\n✅ Done! Results saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()