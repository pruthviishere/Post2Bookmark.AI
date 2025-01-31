 
import { handleBookmarkCreation } from './bookmarkManager.js';
import { categorizePost,categorizePostMulti } from './llmIntegration.js';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (request.message === "addBookmark") {
        const reqDto = request.request; // Access the `reqDto` object
        console.log("Request DTO received:", reqDto);
        if (!reqDto || !reqDto.link || !reqDto.text) {
            console.error("Invalid request data received:", reqDto);
            sendResponse({ success: false, error: "Invalid data" });
            return;
        }
        const { link, text } = reqDto; // Safely destructure the `reqDto` object
        console.log("Processing bookmark with:", { link, text });
        // categorizePost(text)

        categorizePostMulti(text)
				.then(({ category }) => {
					const reqDto = {
						category, // Folder name
						title: text.slice(0, 50), // Optional: Generate a title from text
						url: link,
					};
					handleBookmarkCreation(reqDto);
					sendResponse({ success: true, BookmarkCategory : category});
				})
				.catch((error) => {
					console.error("Error categorizing post:", error);
					sendResponse({ success: false, error: error.message });
				});
	
			return true; // Keep the message channel open for async response
    }
 
	console.log("inside backgroudn liseter ");
	 if (request.message === "get_bookmark_folder") {
		console.log("inside get bookmar folder liseter ");
		// Get all bookmarks within the folder
        chrome.bookmarks.getChildren(function (bookmarks) {//err
            if (chrome.runtime.lastError) {
                console.error("Error fetching bookmarks:", chrome.runtime.lastError.message);
                return;
            }
            console.log("Bookmarks in personal folder:", bookmarks);
            // Pass the bookmarks to the callback
            sendResponse(bookmarks);
        });
 
  }
	if (request.message === "open_option_page")
	{
			chrome.tabs.create({
         url: "option.html"
       });
	}
      return true;
  }
);

chrome.action.onClicked.addListener(tab => {
    chrome.tabs.create({
         url: "option.html"
		
       });
  });

chrome.runtime.onInstalled.addListener((details) => {
    console.log("Extension installed.");
	if (details.reason === "install" || details.reason === 'update') {
        // createPersonalBookmarkFolder();
    }

    chrome.storage.sync.get(["provider", "model", "apiKey", "apiUrl"], (settings) => {
      if (!settings.provider) {
          chrome.storage.sync.set({
              provider: "ollama",
              model: "llama3.2",
              apiKey: "",
              apiUrl: "http://localhost:11434/api/chat"
          }, () => {
              console.log("Default API settings saved.");
              console.log("ollama llama3.2 http://localhost:11434/api/chat");
          });
      }
  });
});
 

 

 