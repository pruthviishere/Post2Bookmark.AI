// llmCategorizer.js

// Categorize a post using either Ollama or OpenAI
export function categorizePost(text, useOllama) {
    const prompt = `
        You are a LinkedIn post categorization system.
        Your task is to categorize it into a specific category such as:
        Job Opportunity in AI/ML/DS,
        Job Opportunity in Software Engineer,
        AI Agents/RAG,
        Interview Preparation or Experiences,
        GitHub Repositories,
        Career Update,
        Data Structures & Algorithms,
        Java,
        System Design,
        Other Learning Resource,
        Data Science,
        AI News,
        Other News,
        Startup/Entrepreneurship.
        If no relevant category is found, return Miscellaneous.
        Please categorize the text and return the result as a JSON object with a key 'category' that holds the category name.
        Below is a LinkedIn post text.
        Post text: "${text}"
        Return the result in the following JSON format:
        {"category": "<CATEGORY_NAME>"}.
    `;
    return new Promise((resolve, reject) => {
        try {
            if (useOllama) {
                categorizeTextOllamaCustom(prompt)
                    .then(resolve)
                    .catch(reject);
            } else {
                categorizeWithOpenAI(prompt)
                    .then(resolve)
                    .catch(reject);
            }
        } catch (error) {
            console.error("Error in categorizePost:", error);
            reject(error);
        }
    });
}


// The categorizeTextOllamaCustom function using fetch API instead of jQuery AJAX
export async function categorizeTextOllamaCustom(prompt) {
    const apiUrl = "http://localhost:11434/api/generate"; // Replace with your actual ChatOllama endpoint
    const modelConfig = {
        model: "llama3.2", // Model to use (can be adjusted based on your setup)
        prompt: prompt,
        temperature: 0.8,
        num_predict: 256,
        format: "json",
        stream: false
    };

    try {
        // Make the API call using fetch
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:11434",
            },
            body: JSON.stringify(modelConfig),
        });

        // Check if the response was successful
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
         // Log the raw response text
        const rawText = await response.text();
        console.log("Raw response text:", rawText);

        // Parse the response as JSON
        const data = JSON.parse(rawText);
        console.log("Parsed JSON data:", data)

        // Parse the response as JSON
        // const data = await response.json();
        console.log("response from llm",data)
        const responseDTO = JSON.parse(data.response);
        const category = responseDTO.category;
        console.log("category ",category)
        if (category) {
            return { category };
        } else {
            // throw new Error("No category found in the response.");
            category = "No category"
            return { category }
        } 

    } catch (error) {
        console.error("Error in categorizeTextOllamaCustom:", error);
        category = "FailedBookmarks"
            return { category }
    }
}
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
            return { category: "Miscellaneous" };
        }
       
        chrome.storage.sync.get(["provider", "model", "apiKey", "apiUrl"], (settings) => {
            
            if (!settings.provider || !settings.model) {
                console.error("API settings are missing.");
                reject("API settings are missing.");
                return;
            }
            const provider = settings.provider || "ollama";  // Default to Ollama
            const model = settings.model || "llama3.2";
            const apiKey = settings.apiKey || "";
            const apiUrl = settings.apiUrl || "http://localhost:11434/api/chat";
            switch ( provider) {
                case "ollama":
                    categorizeWithOllama(prompt,  model).then(resolve).catch(reject);
                    break;
                case "openai":
                    categorizeWithOpenAI(prompt,  model,  apiKey).then(resolve).catch(reject);
                    break;
                case "bedrock":
                    categorizeWithBedrock(prompt,  model,  apiKey,  apiUrl).then(resolve).catch(reject);
                    break;
                case "gemini":
                    generateContentWithGemini(prompt,  model,  apiKey).then(resolve).catch(reject);
                    break;
                case "groq":
                    categorizeWithGroq(prompt,  model,  apiKey,  apiUrl).then(resolve).catch(reject);
                    break;
                default:
                    reject("Invalid provider selected.");
            }
        });
    });
}
async function categorizeWithOllama(prompt, model) {
    // const apiUrl = "http://localhost:11434/api/chat";
    // return await callApi(apiUrl, null, { model, messages: [{ role: "user", content: prompt }] });
    // export async function categorizeTextOllamaCustom(prompt, model) {
        const apiUrl = "http://localhost:11434/api/chat"; // Ollama API endpoint
    
        const requestBody = {
            model: model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            format: "json",
            stream: false
        };
    
        try {
            // Fetch API request to Ollama
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Origin": "http://localhost:11434",
                },
                body: JSON.stringify(requestBody),
            });
    
            // Check if API response was successful
            if (!response.ok) {
                throw new Error(`Ollama API call failed with status: ${response.status}`);
            }
    
            // Read the raw response text
            const rawText = await response.text();
            console.log("Raw response text:", rawText);
    
            // Try parsing the response JSON directly
            let data;
            try {
                data = JSON.parse(rawText);
            } catch (error) {
                console.error("Failed to parse Ollama response as JSON:", error);
                throw new Error("Ollama response is not valid JSON.");
            }
         
    
            // Handle older Ollama versions where response is double-encoded
            let responseDTO;
            try {
                responseDTO = JSON.parse(data.message.content); // Older Ollama versions
            } catch (error) {
                responseDTO = data; // Newer Ollama versions already return JSON
            }
    
            // Extract category
            const category = responseDTO.category;
            console.log("Extracted category:", category);
    
            if (category) {
                return { category };
            } else {
                throw new Error("No category found in the response.");
            }
        } catch (error) {
            console.error("Error in categorizeTextOllamaCustom:", error);
            throw new Error("Failed to process response from Ollama.");
        }
    
    
}

async function categorizeWithOpenAI(prompt, model, apiKey) {
     
    const apiUrl = "https://api.openai.com/v1/chat/completions";  // ✅ Correct endpoint

    const bodyData = {
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    };
    // return await callApi(apiUrl, apiKey, { model, prompt });
    return await callApi(apiUrl, apiKey, bodyData);
}

async function categorizeWithBedrock(prompt, model, apiKey, apiUrl) {
    return await callApi(apiUrl, apiKey, { model, prompt });
}

async function categorizeWithGemini(prompt, model, apiKey) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateText`;
    return await callApi(apiUrl, apiKey, { prompt });
}
async function generateContentWithGemini(prompt, model, apiKey) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const bodyData = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            response_mime_type: "application/json"
        }
    };

    return await callGeminiApi(apiUrl, bodyData);
}

async function callGeminiApi(apiUrl, bodyData) {
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
            console.error("Error:", response.status, await response.text());
            return null;
        }

        const data = await response.json();

        // ✅ Extract response correctly
        if (data.candidates && data.candidates.length > 0) {
            const responseText = data.candidates[0].content.parts[0].text;
            console.log("Gemini API Response:", responseText);

            try {
                return JSON.parse(responseText);  // ✅ Convert text response to JSON
            } catch (e) {
                console.warn("Response is not valid JSON, returning as string.");
                return responseText;
            }
        } else {
            console.error("Unexpected response structure:", data);
            return null;
        }
    } catch (error) {
        console.error("API call failed:", error);
        return "FailedBookmarks";
    }
}

 function categorizeWithGroq(prompt, model, apiKey, apiUrl) {
    if( apiUrl=="http://localhost:11434/api/chat" || !apiKey){
        apiUrl = "https://api.groq.com/openai/v1/chat/completions"
        console.log("categorizeWithGroq api url was not valid setting default one https://api.groq.com/openai/v1/chat/completions")
    }
    let bodyData = { 
        model,
        stream: false, 
        messages: [{ role: "user", content: prompt }],
        response_format:{type: "json_object"},
        stop:null  }
    return  callApi(apiUrl, apiKey, bodyData);
}

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
            console.log(data.choices[0].message?.content, '<---- api');

            return JSON.parse(data.choices[0].message?.content);
        } else {
            console.error(await response.json());
        }
        
    } catch (error) {
        console.error("API call failed:", error);
        return "FailedBookmarks"
        // throw new Error("Failed to process response.");
    }
}

