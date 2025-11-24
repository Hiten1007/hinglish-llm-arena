# AI Assignment 2.1: Hinglish Chatbot Framework Report

**Project:** Multi-Model LLM Comparison for "GogginsBot"
**Date:** November 2025
**Author:** Hiten Gupta

---

## A. Cost Analysis

### 1. Pricing Model Used
*Costs calculated per 1 Million Tokens (based on provided pricing).*
* **Cohere Command A (03-2025):** $2.50 Input / $10.00 Output
* **OpenAI GPT-4o:** $2.50 Input / $10.00 Output
* **Gemini 2.0 Flash:** $0.10 Input / $0.40 Output

### 2. Cost Per Call (Actuals)
*Calculated from the average token usage in our experiment.*

| Model | Avg Input Tokens | Avg Output Tokens | Cost per 1k Calls ($) |
| :--- | :---: | :---: | :---: |
| **Gemini 2.0 Flash** | 113 | 290 | **$0.13** |
| **OpenAI GPT-4o** | 110 | 109 | $1.37 |
| **Cohere Command A** | 110 | 136 | $1.64 |
| **Llama 3 (Local)** | 111 | 250 | $0.00 (Electricity only) |

### 3. Estimated Monthly Cost
*Scenario: 1,000 active users making 5 queries per day (150,000 queries/month).*

* **Most Expensive (Cohere):** ~$246.40 / month
* **Cheapest Commercial (Gemini):** ~$19.20 / month
* **Analysis:** Gemini 2.0 Flash is approximately **12x cheaper** than Cohere Command A and GPT-4o. For a startup or high-volume application, Gemini offers the only viable unit economics, despite the slight drop in linguistic quality.

---

## B. Latency Analysis

### 1. Latency Comparison Chart (Seconds)

| Model | TTFB (Time to First Token) | Total Latency (Full Response) |
| :--- | :--- | :--- |
| **Cohere Command A** | **0.60 s** (Fastest Start) | 6.21 s |
| **Gemini 2.0 Flash** | 0.98 s | **3.32 s** (Fastest Complete) |
| **OpenAI GPT-4o** | 1.69 s | 4.08 s |
| **Llama 3 (Local)** | 19.97 s | 80.83 s |

### 2. TTFB Analysis
* **Cohere Command A (0.60s):** Had the fastest "perceived latency." The connection opens almost instantly, making the chat feel very responsive.
* **Gemini 2.0 Flash (0.98s):** Extremely competitive. Google's infrastructure consistently delivers sub-1-second starts.
* **Llama 3 (19.97s):** The local model performance suggests it was running on CPU or a bandwidth-constrained GPU. A 20-second delay before the first word appears makes this specific local setup unusable for real-time chat.

---

## C. Model Comparison & Quality

### 1. Automated Evaluation Scores (Judged by Qwen 2.5)
*Scores out of 50 (fluency, relevance, tone, accuracy, safety).*

| Model | Average Score | Hinglish Fluency (0-10) | Tone Consistency (0-10) |
| :--- | :---: | :---: | :---: |
| **Cohere Command A** | **45.0** | **9.0** | **10.0** |
| **OpenAI GPT-4o** | 44.0 | 9.0 | 10.0 |
| **Gemini 2.0 Flash** | 42.7 | 8.3 | 9.3 |
| **Llama 3 (Local)** | 41.3 | 8.3 | 9.3 |

### 2. Pros & Cons
* **Cohere Command A (Winner on Quality):**
    * **Pros:** Achieved the highest overall score (45.0). It perfectly nailed the "Goggins" persona (10/10 Tone) and had the fastest TTFB.
    * **Cons:** Most expensive model in the test set (~$246/mo). Even though it scored high in hinglish fluency but generated text in devanagri script in zero shot strategy.
* **OpenAI GPT-4o:**
    * **Pros:** Very consistent. Tied for best Hinglish and Tone.
    * **Cons:** Higher TTFB (1.69s) makes it feel slightly more sluggish than Cohere.
* **Gemini 2.0 Flash (Winner on Value):**
    * **Pros:** Incredible speed (3.3s full response) and unbeatable price ($19/mo).
    * **Cons:** Slightly lower Hinglish fluency (8.3), occasionally drifting into more formal language.
* **Llama 3 (Local):**
    * **Pros:** Complete data privacy.
    * **Cons:** Failed the latency test completely (~81s response time). Needs quantization or better hardware to be viable.

### 3. Final Verdict
**Best for Production: Gemini 2.0 Flash**
While Cohere Command A scored slightly higher on quality (45 vs 42.7), the cost difference is massive. Gemini provides 95% of the quality for 8% of the cost. For a customer-facing bot, the sub-1-second latency and low price make it the superior engineering choice.

---

## D. Architecture Diagram
*System Overview*

graph TD
    %% 1. The Input
    User[User Query] --> PromptLayer
    
    %% 2. The Prompting Layer
    subgraph "Prompting Layer"
        PromptLayer[Prompt Engineering Logic]
        Strategy1[Zero-Shot]
        Strategy2[Few-Shot]
        Strategy3[Structured]
    end
    
    PromptLayer --> Strategy1 & Strategy2 & Strategy3
    
    %% 3. The API Layer
    subgraph "API Layer"
        Strategy1 & Strategy2 & Strategy3 --> Router{API Router}
        Router --> OpenAI[OpenAI GPT-4o]
        Router --> Gemini[Gemini 2.0 Flash]
        Router --> Cohere[Cohere Command A]
        Router --> Local["Llama 3 (Local)"]
    end

    %% 4. The Logging System
    subgraph "Logging System"
        OpenAI & Gemini & Cohere & Local --> CSV["cost_latency.csv"]
        OpenAI & Gemini & Cohere & Local --> Files["/responses folder"]
    end

    %% 5. The Evaluation Layer
    subgraph "Evaluation Layer"
        Files --> Judge["Judge Model (Qwen)"]
        Judge --> Scores["evaluations.json"]
    end