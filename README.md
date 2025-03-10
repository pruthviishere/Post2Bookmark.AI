# 📌 Post2Bookmark.AI - Smarter LinkedIn Bookmarking with AI  

![Post2Bookmark.AI](https://img.shields.io/badge/Chrome%20Extension-AI%20Powered-blue)  
*A powerful Chrome extension that lets you save and categorize LinkedIn posts using AI—now with support for Ollama, Groq, OpenAI, and Gemini!* 🚀  

---

## ✨ Features  
✅ **AI-Powered Categorization** – Organizes saved posts into relevant folders automatically.  
✅ **Multi-LLM Support** – Choose from **Ollama, Groq, OpenAI, or Gemini** as your AI provider.  
✅ **No Local AI Setup Needed** (for Groq, OpenAI, and Gemini) – Just add your **API keys** and start in **2 minutes**.  
✅ **Full Local AI Support with Ollama** – Run AI **locally** with **no API dependency**.  
✅ **Smart API Handling** –  
   - No need to manually enter API URLs for **OpenAI & Gemini**.  
   - **Ollama runs locally**, so no API key required.  
✅ **Tested with Best Models**:  
   - 🦙 **Ollama** → `llama3.2:latest`  
   - ⚡ **Groq** → `llama-3.1-8b-instant`  
   - 🤖 **OpenAI** → `gpt-4o-mini`  
   - 🌟 **Gemini** → `gemini-2.0-flash`  
✅ **One-Click Bookmarking** – Save LinkedIn posts instantly with AI-powered categorization.  

---

## 🔧 Prerequisites for Ollama Users  
- **Ollama installed** and running locally.  
- **Model required:** `llama3.2:latest`  
- If using a **different Ollama model**, update the **`categorizeTextOllamaCustom`** method in `llmIntegration.js` at **line 102**.  

---

## 📥 Installation (For All Users)  
### **1️⃣ Clone or Download**  
```sh
git clone https://github.com/yourusername/Post2Bookmark.AI.git
cd Post2Bookmark.AI
```

## 2️⃣ Load the Extension in Chrome

1.  Open `chrome://extensions/`
2.  Enable **Developer Mode** (top-right corner).
3.  Click **"Load Unpacked"** and select the `Post2Bookmark.AI` folder.

## 3️⃣ Setup API Keys (For Groq, OpenAI, or Gemini Users)

1.  Click the `Post2Bookmark.AI` extension icon in Chrome.
2.  Select your LLM provider (Groq, OpenAI, Gemini).
3.  Provide your API key and model name. OpenAI & Gemini do **NOT** require an API URL.
4.  Save settings and start bookmarking! 🚀

## 🔧 Setup for Ollama (Local AI)

1.  Install Ollama from [Ollama's official site](https://ollama.com/).
2.  Make sure `llama3.2:latest` is installed and running:

    ```sh
    ollama run llama3.2
    ```

3.  If using a different model, update `llmIntegration.js` at line 102.
4.  Restart Ollama if needed:

    ```sh
    sudo systemctl restart ollama
    ```

## 🛠 Supported Models & Providers

| Provider         | Model               |
| ---------------- | ------------------- |
| Ollama (Local)   | `llama3.2:latest`  |
| Groq             | `llama-3.1-8b-instant` |
| OpenAI           | `gpt-4o-mini`       |
| Gemini           | `gemini-2.0-flash`  |

## 🔐 Privacy & Security

* **Ollama Mode** – No internet required. All processing happens locally.
* **Cloud AI Mode (Groq/OpenAI/Gemini)** – Your API keys are stored securely in Chrome storage.

## 📢 Feedback & Issues

Found a bug? Have suggestions? Open an issue in this repo!

🔗 **GitHub Repo:** [Post2Bookmark.AI](https://github.com/pruthviishere/Post2Bookmark.AI)

🔥 Star this repo if you find it useful! ⭐

#AI #ChromeExtension #Ollama #Groq #OpenAI #Gemini #Bookmarking #Productivity
