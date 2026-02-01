// llmIntegration.js

// Orchestrator function to categorize post based on settings
export function categorizePostMulti(text) {
    const prompt = `
        You are a LinkedIn post categorization system.
        Categorize the text into one of these categories:
        Job Opportunity in AI/ML/DS, Software Engineer, AI Agents, Interview Prep, GitHub Repos, etc.
        response format json.
        Return JSON format: {"category": "<CATEGORY_NAME>"}
        Post text: "${text}"
    `;

    return new Promise((resolve, reject) => {
        if (!chrome.storage || !chrome.storage.sync) {
            console.error("chrome.storage is not available.");
            resolve({ category: "Miscellaneous" });
            return;
        }
       
        chrome.storage.sync.get(["provider", "model", "apiKey", "apiUrl"], (settings) => {
            
            if (!settings.provider) {
                console.error("API settings are missing.");
                reject("API settings are missing.");
                return;
            }
            const provider = settings.provider || "ollama";
            const model = settings.model || "llama3.2";
            const apiKey = settings.apiKey || "";
            // Default API URL logic can be handled inside specific functions if not provided

            switch (provider) {
                case "ollama":
                    categorizeWithOllama(prompt, model).then(resolve).catch(reject);
                    break;
                case "openai":
                    categorizeWithOpenAI(prompt, model, apiKey).then(resolve).catch(reject);
                    break;
                case "gemini":
                    categorizeWithGemini(prompt, model, apiKey).then(resolve).catch(reject);
                    break;
                case "groq":
                    categorizeWithGroq(prompt, model, apiKey, settings.apiUrl).then(resolve).catch(reject);
                    break;
                case "anthropic":
                    categorizeWithAnthropic(prompt, model, apiKey).then(resolve).catch(reject);
                    break;
                case "openrouter":
                    categorizeWithOpenRouter(prompt, model, apiKey).then(resolve).catch(reject);
                    break;
                default:
                    reject("Invalid provider selected.");
            }
        });
    });
}

// Deprecated single-use function (kept for compatibility if needed, but implementation redirects to multi)
export function categorizePost(text, useOllama) {
    return categorizePostMulti(text);
}

async function categorizeWithOllama(prompt, model) {
    const apiUrl = "http://localhost:11434/api/chat";
    
    const requestBody = {
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        format: "json",
        stream: false
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Origin": "http://localhost:11434", // Usually not needed for localhost to localhost, but might be for extensions
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Ollama API call failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Handle response content
        let content = data.message?.content;
        if (!content) throw new Error("No content in Ollama response");

        // Parse JSON if it's a string
        if (typeof content === 'string') {
            try {
                return JSON.parse(content);
            } catch (e) {
                console.error("Failed to parse Ollama content as JSON", content);
                // Try to fallback
                return { category: "Miscellaneous" };
            }
        }
        return content;

    } catch (error) {
        console.error("Error in categorizeWithOllama:", error);
        return { category: "FailedBookmarks" };
    }
}

async function categorizeWithOpenAI(prompt, model, apiKey) {
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const bodyData = {
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    };
    return await callApi(apiUrl, apiKey, bodyData);
}

async function categorizeWithAnthropic(prompt, model, apiKey) {
    const apiUrl = "https://api.anthropic.com/v1/messages";
    const bodyData = {
        model: model,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.content[0].text;

        try {
            return JSON.parse(content);
        } catch (e) {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error("Failed to parse JSON from Anthropic response");
        }

    } catch (error) {
        console.error("Error in categorizeWithAnthropic:", error);
        return { category: "FailedBookmarks" };
    }
}

async function categorizeWithOpenRouter(prompt, model, apiKey) {
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    const bodyData = {
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/Pruthvi360/Post2Bookmarks",
                "X-Title": "Post2Bookmarks.AI"
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
             const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        if (typeof content === 'string') {
             try {
                return JSON.parse(content);
            } catch (e) {
                 return { category: "Miscellaneous" };
            }
        }
        return content;

    } catch (error) {
        console.error("Error in categorizeWithOpenRouter:", error);
        return { category: "FailedBookmarks" };
    }
}

async function categorizeWithGemini(prompt, model, apiKey) {
    // Uses the v1beta generateContent API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const bodyData = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            response_mime_type: "application/json"
        }
    };

    try {
        const headers = {
            "Content-Type": "application/json"
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            console.error("Gemini Error:", response.status, await response.text());
            return { category: "FailedBookmarks" };
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            const responseText = data.candidates[0].content.parts[0].text;
            try {
                return JSON.parse(responseText);
            } catch (e) {
                console.warn("Response is not valid JSON, returning as is.");
                return { category: "Miscellaneous" };
            }
        } else {
            console.error("Unexpected Gemini response structure:", data);
            return { category: "FailedBookmarks" };
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return { category: "FailedBookmarks" };
    }
}

function categorizeWithGroq(prompt, model, apiKey, apiUrl) {
    const defaultUrl = "https://api.groq.com/openai/v1/chat/completions";
    // If apiUrl is localhost (default from settings init) or empty, use default Groq URL
    if (!apiUrl || apiUrl.includes("localhost")) {
        apiUrl = defaultUrl;
    }

    let bodyData = { 
        model,
        stream: false, 
        messages: [{ role: "user", content: prompt }],
        response_format:{type: "json_object"},
        stop:null
    };
    return callApi(apiUrl, apiKey, bodyData);
}

// Generic API caller for OpenAI-compatible endpoints
async function callApi(apiUrl, apiKey, bodyData) {
    try {
        const headers = {
            "Content-Type": "application/json",
        };
        if (apiKey) {
            headers["Authorization"] = `Bearer ${apiKey}`;
        }

        const response = await fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(bodyData),
        });
            
        if (response.ok) {
            const data = await response.json();
            const content = data.choices[0].message?.content;
            console.log(content, '<---- api');

            if (typeof content === 'string') {
                 try {
                    return JSON.parse(content);
                } catch (e) {
                    return { category: "Miscellaneous" };
                }
            }
            return content;
        } else {
            console.error(await response.json());
             return { category: "FailedBookmarks" };
        }
        
    } catch (error) {
        console.error("API call failed:", error);
        return { category: "FailedBookmarks" };
    }
}
