# Post2Bookmark.AI


📌  A lightweight Chrome extension that helps you save and categorize posts with a single click.it uses AI categorization to organize your bookmarks for easy access—all while keeping your data private and secure.


🌟 Features
Save Posts Instantly: A dedicated "Save" button makes bookmarking seamless.

AI-Powered Categorization: Automatically sorts bookmarks into relevant folders using advanced AI models (powered by Ollama).

Privacy First: Your data stays local. No external servers, no data collection.

Custom Folders: Organize your bookmarks into folders for better management.

prerequisites: Ollama , llama 3.2:latest
if you are running other you need to change llmIntegration.js Method 
categorizeTextOllamaCustom Line no 102 with your ollama model.

Will add support for OpenAI API and other providers.


🚀 Getting Started
Installation


git releases 
download zip or clone repo
Open Chrome and go to:
chrome://extensions/

Enable Developer Mode (top-right corner).

Click Load Unpacked and select the folder where you cloned this repository.

Allow ollama access 
All bookmarks are stored locally on your machine.
make sure llama3.2:latest is install and running as ollama device
https://github.com/ollama/ollama/issues/4115#issuecomment-2254177024
after the executing command you need to restart Ollama.

The extension is now ready to use! 🎉

🛠️ How It Works
When you browse LinkedIn or other websites, click the "Save" button on the post to bookmark it.
The extension uses Ollama AI models to categorize the post into pre-defined categories such as:
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
       
And more!
Saved bookmarks are stored locally in your browser’s Bookmark Manager under the folder “Post2Bookmark.AI”.


🔐 Privacy Policy
This extension does not collect, track, or send user data to any external servers.

All bookmarks are stored locally on your machine.


🤝 Contributing
It is in development phase you might encounter issue, please report in Issues section.
Contributions are welcome! If you have ideas, suggestions, or want to improve the extension:

Fork the repository.
Make your changes.
Submit a pull request.
We’d love to hear from you!


🧠 Powered By
Ollama: AI-based categorization.
Chrome Extensions API
📧 Contact Us
If you have questions or need support, Open Issue

⚖️ License
This project is licensed under the GPL License.

