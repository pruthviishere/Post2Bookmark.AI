document.addEventListener('DOMContentLoaded', () => {
    const providerSelect = document.getElementById("provider");
    const modelInput = document.getElementById("model");
    const apiKeyInput = document.getElementById("apiKey");
    const apiUrlInput = document.getElementById("apiUrl");
    const saveButton = document.getElementById("saveApiSettings");

    // Load saved settings
    chrome.storage.sync.get(["provider", "model", "apiKey", "apiUrl"], (data) => {
        providerSelect.value = data.provider || "ollama";
        modelInput.value = data.model || "";
        apiKeyInput.value = data.apiKey || "";
        apiUrlInput.value = data.apiUrl || "";
    });

    saveButton.addEventListener("click", () => {
        const provider = providerSelect.value;
        const model = modelInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        const apiUrl = apiUrlInput.value.trim();

        chrome.storage.sync.set({ provider, model, apiKey, apiUrl }, () => {
            alert("API settings saved successfully!");
        });
    });
});
