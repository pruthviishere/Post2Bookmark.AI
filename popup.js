document.addEventListener('DOMContentLoaded', () => {
    const providerSelect = document.getElementById("provider");
    const modelInput = document.getElementById("model");
    const apiKeyInput = document.getElementById("apiKey");
    const apiUrlInput = document.getElementById("apiUrl");
    const saveButton = document.getElementById("saveApiSettings");

    // Load saved settings from storage
    chrome.storage.sync.get(["provider", "model", "apiKey", "apiUrl"], (data) => {
        if (data.provider) providerSelect.value = data.provider;
        if (data.model) modelInput.value = data.model;
        if (data.apiKey) apiKeyInput.value = data.apiKey;
        if (data.apiUrl) apiUrlInput.value = data.apiUrl;
    });


    saveButton.addEventListener("click", () => {
        const provider = providerSelect.value;
        const model = modelInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        const apiUrl = apiUrlInput.value.trim();

        chrome.storage.sync.set({ provider, model, apiKey, apiUrl }, () => {
            // Visual feedback instead of alert
            saveButton.textContent = "Saved!";
            saveButton.classList.add("saved");

            setTimeout(() => {
                saveButton.textContent = "Save";
                saveButton.classList.remove("saved");
            }, 2000);
        });
    });
});
