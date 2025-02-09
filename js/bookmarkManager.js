/**
 * Searches for a folder by name in the bookmark tree.
 * @param {Array} bookmarks - The bookmark tree.
 * @param {string} folderName - The folder name to search for.
 * @returns {object|null} - Found folder object or null.
 */
function findFolderByName(bookmarks, folderName) {
    // console.log("findFolderByName folderName:",folderName)
    for (let bookmark of bookmarks) {
        if (bookmark.title === folderName) {
            console.log("bookmark found",bookmark)
            return bookmark;
        }
        if (bookmark.children) {
            const found = findFolderByName(bookmark.children, folderName);
            if (found) {
                console.log("folder found",found.id, found)
                return found;
            }
        }
    }
    return null;
}

/**
 * Creates a new folder under the specified parent ID.
 * @param {string} parentId - The ID of the parent folder.
 * @param {string} folderName - The name of the folder to create.
 * @param {function} callback - Callback to handle the created folder.
 */
function createFolder(parentId, folderName, callback) {
    chrome.bookmarks.create(
        { parentId: parentId, title: folderName },
        (newFolder) => {
            if (chrome.runtime.lastError) {
                console.error("Error creating folder:", chrome.runtime.lastError.message);
            } else {
                callback(newFolder);
            }
        }
    );
}

/**
 * Adds a bookmark to a specified folder.
 * @param {string} folderId - The folder ID.
 * @param {string} title - Bookmark title.
 * @param {string} url - Bookmark URL.
 */
function addBookmark(folderId, title, url) {
    console.log("addBookmark:",folderId,title,url)
    chrome.bookmarks.create(
        { parentId: folderId, title: title, url: url },
        (newBookmark) => {
            if (chrome.runtime.lastError) {
                console.error("Error adding bookmark:", chrome.runtime.lastError.message);
            } else {
                console.log("Bookmark added successfully with folder id :", newBookmark, folderId);
            }
        }
    );
}

/**
 * Main function to handle creating or adding bookmarks.
 * @param {object} reqDto - Request data containing category, title, and URL.
 */
export function handleBookmarkCreation(reqDto) {
    const { category, title, url } = reqDto;
    const parentFolderName = "Post2Bookmarks.AI";
    console.log("in hanle bookmark ".category,title,url)
    // Get bookmarks tree
    chrome.bookmarks.getTree((bookmarkTree) => {
        if (chrome.runtime.lastError) {
            console.error("Error fetching bookmarks:", chrome.runtime.lastError.message);
            return;
        }
        console.log("printing bookmark tree",bookmarkTree)
        // Find or create the parent folder
        let parentFolder = findFolderByName(bookmarkTree, parentFolderName);
        if (!parentFolder) {
            createFolder("2", parentFolderName, (newParentFolder) => {
                findOrCreateCategoryFolder(newParentFolder.id, category, title, url);
            });
        } else {
            findOrCreateCategoryFolder(parentFolder.id, category, title, url);
        }
    });
}

/**
 * Finds or creates a category folder and adds the bookmark.
 * @param {string} parentFolderId - Parent folder ID.
 * @param {string} category - Category folder name.
 * @param {string} title - Bookmark title.
 * @param {string} url - Bookmark URL.
 */
function findOrCreateCategoryFolder(parentFolderId, category, title, url) {
    chrome.bookmarks.getChildren(parentFolderId, (children) => {
        const categoryFolder = children.find((child) => child.title === category);
        if (!categoryFolder) {
            createFolder(parentFolderId, category, (newCategoryFolder) => {
                addBookmark(newCategoryFolder.id, title, url);
            });
        } else {
            addBookmark(categoryFolder.id, title, url);
        }
    });
}

function initializePersonalFolder() {
    const folderName = "Post2Bookmarks.AI";

    chrome.bookmarks.getTree((tree) => {
        if (!findFolderByName(tree, folderName)) {
            createFolder("1", folderName, (folder) => {
                console.log(`Folder "${folderName}" created with ID: ${folder.id}`);
            });
        }
    });
}
