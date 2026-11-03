const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Pehla model fail ho (404 / 429 / 503) to agla try hoga
const MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
];

const MAX_ATTEMPTS = 3;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callGroq = async (model, prompt) => {
    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
            max_completion_tokens: 8000,
            // gpt-oss reasoning model hai: low = jaldi jawab
            reasoning_effort: "low",
            // valid JSON hi return karega (prompt me "JSON" likha hona zaroori hai)
            response_format: { type: "json_object" }
        }),
        signal: AbortSignal.timeout(60000)
    })

    if (!response.ok) {
        const err = new Error(await response.text());
        err.status = response.status;
        throw err;
    }

    return response.json();
}

export const generateAIResponse = async (prompt) => {
    let lastError;

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                const data = await callGroq(model, prompt);

                const text = data.choices?.[0]?.message?.content;
                if (!text) {
                    throw new Error("No text returned from Groq");
                }

                const cleanText = text
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                return JSON.parse(cleanText);

            } catch (error) {
                lastError = error;
                console.error(`Groq error (${model}, attempt ${attempt}/${MAX_ATTEMPTS}):`, error.message);

                // model nahi mila: seedha agle model pe jao
                if (error.status === 404) {
                    break;
                }

                // sirf 429 (limit), 5xx (server) aur timeout pe retry karo
                const retryable =
                    error.status === 429 ||
                    error.status >= 500 ||
                    error.name === "TimeoutError";

                if (!retryable) {
                    throw new Error("Groq API request failed");
                }

                if (attempt < MAX_ATTEMPTS) {
                    await sleep(2000 * attempt); // 2s, 4s
                }
            }
        }
        console.error(`Model ${model} unavailable, next model try ho raha hai...`);
    }

    console.error("All Groq models failed:", lastError?.message);
    throw new Error("AI is busy right now. Please try again in a minute.");
}