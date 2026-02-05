$(document).ready(function () {
    const folderIcon = chrome.runtime.getURL('images/folder.png');
    const crossIcon = chrome.runtime.getURL('images/cross.png');
    const collapseIcon = chrome.runtime.getURL('images/collapse.png');
    const expandIcon = chrome.runtime.getURL('images/expand.png');
    const addIcon = chrome.runtime.getURL('images/add.png');
    const darkMode = $(".theme--dark").length > 0;
    const buttonHTML = `<button style='font-size: 1.4rem;color: ${darkMode ? "#c8ccd0" : "#666666"};font-weight: 600;' class='save_post_button'>Save</button>`;
    const popupHTML = `
        <div class='bookmark_folder_popup' style='position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width:350px;background:${darkMode ? "#292929" : "#fff"};z-index: 1;border-radius: 5px;box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);'>
            <div class='bookmark_folder_popup_header' style='width:100%; font-weight: 700;border-bottom: 1px #e0e0e0 solid;height: 35px;padding: 5px 15px;'>Select Folder
                <img src='${chrome.runtime.getURL("images/question.png")}' width='12' style='cursor:pointer' id='questionIcon'/>
            </div>
            <div class='bookmark_folder_popup_close' style='position: absolute;top: 5px;right: 10px;cursor: pointer;'>
                <img src='${crossIcon}' width='12'/>
            </div>
            <div class='bookmark_folder_popup_list' style='overflow-y:scroll;margin-top: 10px;height: 300px;padding-left: 15px;margin-bottom: 10px;'>
                <ul style='list-style:none;'></ul>
            </div>
        </div>`;

    let post_url = "";

$('body').on('click', '.save_post_button', function () {
    const postContainer = $(this).closest('.feed-shared-update-v2');
    const urn = postContainer.attr("data-urn");

    if (!urn) {
        console.error("URN not found.");
        return;
    }

    const postText = postContainer.find('.update-components-text.relative.update-components-update-v2__commentary > span')
        .text()
        .trim();

    if (!postText) {
        console.error("Post text not found.");
        return;
    }

    // console.log("Selected URN:", urn);
    // console.log("Post Text:", postText);

    post_url = `https://www.linkedin.com/feed/update/${urn}`;
 
    requestDto = {
        link:post_url,
        text:postText
    }
    addBookmarkMethod(requestDto)
});
    // Function to add the save button to a specific container
    function addSaveButtonToContainer(container) {
        if ($(container).find(".save_post_button").length === 0) {
            $(container).append(buttonHTML);
        }
    }

    // Initial check for existing posts
    $(".feed-shared-social-action-bar").each(function () {
        addSaveButtonToContainer(this);
    });

    // Use MutationObserver to add Save button dynamically to new posts
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                $(mutation.addedNodes).each(function() {
                    if (this.nodeType === 1) {
                        // Check if the added node itself is the target
                        if ($(this).hasClass('feed-shared-social-action-bar')) {
                            addSaveButtonToContainer(this);
                        }
                        // Also check descendants
                        $(this).find(".feed-shared-social-action-bar").each(function () {
                            addSaveButtonToContainer(this);
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Close the bookmark folder popup
    $("body").on('click', '.bookmark_folder_popup_close', function () {
        $(".bookmark_folder_popup").remove();
    });

 
    function showBookMarks(){
         chrome.runtime.sendMessage({ message: "get_bookmark_folder"}, function (res) {
            console.log("res ",res)
            if (res) {
                return res
            } else {
                alert("Failed to show bookmark folder.");
            }
        });
    }
 

   function addBookmarkMethod(reqdto){
    console.log("Sending message to background:", reqdto);
    chrome.runtime.sendMessage({ message: "addBookmark",request:reqdto}, function (res) {
       console.log("res ",res)
       
       if (res) {
           // alert(`Post saved successfully in folder: ${folderName}`);
           // $(".bookmark_folder_popup").remove();

        if (res.success) {
            console.log("results ",res)
            console.log("Operation was successful!");
            // alert(`Bookmark saved to folder: ${res.BookmarkCategory}`);
            alert("Bookmark saved to folder: " + res.BookmarkCategory);
        } else {
            console.log("Operation failed:", res.error);
            alert("bookmark failed")
        }
        
           
           
       } else {
        console.log("Failed to addBookmarkMethod.");
       }
   });
}
 
});


