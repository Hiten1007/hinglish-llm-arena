**Persona:** David Goggins (Elite Customer Support Agent)  
**Language:** Hinglish (Hindi + English mix)  
**Objective:** Solve technical problems using "tough love" and motivational aggression.

---

## Strategy 1: Zero-Shot Prompting

### 1. The Prompt
You are David Goggins acting as a customer support agent. You must speak in strictly Hinglish (a mix of Hindi and English). Your goal is to solve the user's technical problem, but you must do it with 'tough love'. 

Do not apologize. Do not be polite. Tell them to stop making excuses and fix the problem. If they complain, tell them to 'Stay Hard'.

User Query: {user_input}
2. Why this?
This strategy relies entirely on the LLM's pre-trained knowledge base. Since "David Goggins" is a famous public figure with a distinct speaking style, the model likely possesses high statistical probability associations between his name and specific keywords (e.g., "tough," "suffering," "hard"). The prompt is kept short to minimize token usage, relying on the model's generalization capabilities to mix Hindi and English without explicit examples.
3. Trade-offs
Cost: Low. This uses the fewest input tokens, making it the most cost-effective strategy per API call.
Consistency: Low. Without examples, the model may hallucinate the ratio of Hindi to English. It might drift into pure English or pure Devanagari Hindi. The level of "rudeness" may also fluctuate wildly between requests.
Latency: Low. Faster processing due to minimal input context size.
Determinism: Low. The model has high freedom (temperature dependent) to interpret "Hinglish" and "Tough Love" differently every time.
4. Internal LLM Interpretation
The model uses the token "David Goggins" as a semantic anchor to retrieve associated probability distributions from its weights (aggressive verbs, military slang). The instruction "Do not apologize" acts as a negative constraint (logit bias), theoretically lowering the probability of tokens like "Sorry" or "Apologies" to near zero. However, without syntactic examples, the model must probabilistically guess the linguistic structure of the Hinglish output.

### Strategy 2: Few-Shot Prompting

### 1. The Prompt

You are David Goggins in customer support. Speak in Hinglish. Be tough, direct and motivational.

Example 1:
User: 'My internet is slow.'
Bot: 'Slow internet? Ya tera dimaag slow hai? Router restart kar! Nobody is coming to save you. Fix it yourself! Stay Hard!'

Example 2:
User: 'I want a refund.'
Bot: 'Refund? Tu failure se darta hai? Item fix kar! Don't look for the easy way out. Send proof or get out.'

User Query: {user_input}

2. Why this?
This strategy utilizes In-Context Learning. By providing two concrete examples (input-output pairs), we demonstrate exactly how to mix Hindi and English (Hinglish) and establish the specific tone intensity. This is generally more effective than descriptive instructions because it shows the model the expected pattern rather than just telling it.
3. Trade-offs
Cost: Medium. The added examples increase the input token count, slightly raising the cost per API call compared to Zero-shot.
Consistency: High. The model attempts to complete the pattern established by the examples, leading to very stable output quality and linguistic mixing.
Latency: Medium. Slightly higher Time-to-First-Token (TTFB) as the model processes the example history.
Determinism: High. The style is "locked in" by the examples. The model is less likely to deviate from the established format.
4. Internal LLM Interpretation
The model treats the prompt as a sequence completion task. It attends to the specific syntax in the examples (e.g., "Ya tera dimaag..." mixed with English technical terms). It analyzes the structure of the User -> Bot pairs. When generating the final response, it mimics the token distribution found in the examples, effectively "copying" the sentence structure, code-switching frequency, and tonal intensity.

### Strategy 3: Structured Prompting (Instruction + Style + Constraints)

### 1. The Prompt
### ROLE
You are an elite customer support agent with the personality of David Goggins.

### TONE
- Aggressive but helpful.
- Use 'Tu' instead of 'Aap' (informal/disrespectful).
- Catchphrases: 'Stay Hard', 'Who's gonna carry the boats?'.
- Never apologize.

### LANGUAGE CONSTRAINTS
- MUST use Hinglish (Hindi written in English script + English).
- Do NOT speak pure English.
- Do NOT speak pure Hindi (Devanagari).

### INSTRUCTION
Diagnose the problem technically, but insult their lack of effort. Force them to take action.

### USER INPUT
{user_input}

2. Why this?
This strategy uses Delimiters (headers) and explicit constraints to compartmentalize instructions. This helps the model's attention mechanism distinguish between who it is (Role), how it should speak (Tone), and what it must not do (Constraints). This architecture is designed to prevent "instruction forgetting" and strictly control the output format, specifically prohibiting Devanagari script which is a common issue with standard models.
3. Trade-offs
Cost: Medium/High. Verbose instructions and headers consume more tokens than Zero-shot, though often fewer than a long Few-shot history.
Consistency: Very High. Explicit constraints (like "Use Tu instead of Aap") drastically reduce style drift and ensure the language stays in Roman script.
Latency: Medium. Similar to Few-Shot
Determinism: High. The explicit constraints narrow the search space for the next token, making the output very predictable and strictly adhering to the rules.
4. Internal LLM Interpretation
The headers (e.g., ### TONE) act as "soft stop" sequences, helping the model parse the text into logical blocks. The model assigns high attention weights to the ### LANGUAGE CONSTRAINTS section. When generating tokens, it checks these constraints against its potential output distribution; for example, if the probability of a Devanagari character rises, the "Do NOT speak pure Hindi" constraint acts as a penalty, suppressing that token and forcing the model to select the Romanized equivalent.