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

// Categorize with OpenAI (simulated example)
export function categorizeWithOpenAI(prompt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ category: "Simulated OpenAI Category" });
        }, 500); // Simulating API latency
    });
}
/*
// Categorize with ChatOllama
export function categorizeWithOllama(prompt) {
    return new Promise((resolve, reject) => {
        const apiUrl = "http://localhost:11434/api/generate"; // Replace with your actual ChatOllama endpoint
        const modelConfig = {
            model: "llama3.2", // Model to use (can be adjusted based on your setup)
            prompt: prompt,
            temperature: 0.8,
            num_predict: 256,
        };

        // Make the API call using jQuery
        $.ajax({
            url: apiUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(modelConfig),
            success: function (response) {
                try {
                    // Parse the response to extract the category
                    const data = response; // Assuming the response is already a JSON object
                    const category = data.category;
                    if (category) {
                        console.log(`Categorized text: ${category}`);
                        resolve({ category });
                    } else {
                        reject(new Error("No category found in the response."));
                    }
                } catch (error) {
                    console.error("Error processing response:", error);
                    reject(new Error("Failed to process response from ChatOllama."));
                }
            },
            error: function (xhr, status, error) {
                console.error("Error during API call:", xhr, status, error);
                reject(new Error(`Error during API call: ${status} - ${error}`));
            },
        });
    });
}*/
// llmIntegration.js

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
            throw new Error("No category found in the response.");
        } 

    } catch (error) {
        console.error("Error in categorizeTextOllamaCustom:", error);
        throw new Error("Failed to process response from ChatOllama.");
    }
}
