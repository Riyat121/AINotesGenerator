const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Pehla model fail ho (503 / 429) to agla try hoga
const MODELS = [
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
];

const MAX_ATTEMPTS = 3;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callGemini = async (model, prompt) => {
    const response = await fetch(`${BASE_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        }),
        // 60 sec me jawab na aaye to hang hone ki jagah error aa jaye
        signal: AbortSignal.timeout(60000)
    })

    if (!response.ok) {
        const err = new Error(await response.text());
        err.status = response.status;
        throw err;
    }

    return response.json();
}

export const generateGeminiResponse = async (prompt) => {
    let lastError;

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                const data = await callGemini(model, prompt);

                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!text) {
                    throw new Error("No text returned from Gemini");
                }

                const cleanText = text
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                return JSON.parse(cleanText);

            } catch (error) {
                lastError = error;

                // sirf 503 (overload), 429 (limit) aur timeout pe retry karo
                const retryable =
                    error.status === 503 ||
                    error.status === 429 ||
                    error.name === "TimeoutError";

                console.error(`Gemini error (${model}, attempt ${attempt}/${MAX_ATTEMPTS}):`, error.message);

                // model hi nahi mila / available nahi: seedha agle model pe jao
                if (error.status === 404) {
                    break;
                }

                if (!retryable) {
                    throw new Error("Gemini API fetch failed");
                }

                if (attempt < MAX_ATTEMPTS) {
                    await sleep(2000 * attempt); // 2s, 4s
                }
            }
        }
        console.error(`Model ${model} unavailable, next model try ho raha hai...`);
    }

    console.error("All Gemini models failed:", lastError?.message);
    throw new Error("Gemini is busy right now. Please try again in a minute.");
}