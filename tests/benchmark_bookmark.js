
const { performance } = require('perf_hooks');

// Mock data generator
function generateMockBookmarks() {
    const root = {
        id: '0',
        title: 'Root',
        children: [
            {
                id: '1',
                title: 'Bookmarks Bar',
                children: []
            },
            {
                id: '2',
                title: 'Other Bookmarks',
                children: []
            }
        ]
    };

    // Fill Bookmarks Bar with noise
    for (let i = 0; i < 5000; i++) {
        const folder = {
            id: `1_${i}`,
            title: `Folder ${i}`,
            children: []
        };
        for (let j = 0; j < 10; j++) {
            folder.children.push({
                id: `1_${i}_${j}`,
                title: `Subfolder ${j}`,
                url: 'http://example.com'
            });
        }
        root.children[0].children.push(folder);
    }

    // Add target to Other Bookmarks
    root.children[1].children.push({
        id: 'target',
        title: 'Post2Bookmarks.AI',
        children: []
    });

    return [root]; // getTree returns an array
}

// Original Function
function findFolderByName_Original(bookmarks, folderName) {
    // console.log("findFolderByName folderName:",folderName)
    for (let bookmark of bookmarks) {
        if (bookmark.title === folderName) {
            // console.log("bookmark found",bookmark)
            return bookmark;
        }
        if (bookmark.children) {
            const found = findFolderByName_Original(bookmark.children, folderName);
            if (found) {
                // console.log("folder found",found.id, found)
                return found;
            }
        }
    }
    return null;
}

// Optimized Function (Matching implementation in js/bookmarkManager.js)
function findFolderByName_Optimized(bookmarks, folderName) {
    // Check current level first
    for (let bookmark of bookmarks) {
        if (bookmark.title === folderName) {
            // console.log("bookmark found", bookmark);
            return bookmark;
        }
    }

    // Prioritize known locations: '2' (Other Bookmarks) then '1' (Bookmarks Bar)
    const priorityIds = ['2', '1'];
    for (let id of priorityIds) {
        const target = bookmarks.find(b => b.id === id);
        if (target && target.children) {
            const found = findFolderByName_Optimized(target.children, folderName);
            if (found) {
                // console.log("folder found", found.id, found);
                return found;
            }
        }
    }

    // Search in other folders
    for (let bookmark of bookmarks) {
        if (priorityIds.includes(bookmark.id)) continue;

        if (bookmark.children) {
            const found = findFolderByName_Optimized(bookmark.children, folderName);
            if (found) {
                // console.log("folder found", found.id, found);
                return found;
            }
        }
    }
    return null;
}

const bookmarks = generateMockBookmarks();
const targetName = 'Post2Bookmarks.AI';

console.log("Running benchmark...");

// Measure Original
const startOriginal = performance.now();
const resultOriginal = findFolderByName_Original(bookmarks, targetName);
const endOriginal = performance.now();
const timeOriginal = endOriginal - startOriginal;

console.log(`Original Result found: ${resultOriginal ? 'Yes' : 'No'}`);
console.log(`Original Time: ${timeOriginal.toFixed(4)} ms`);

// Measure Optimized
const startOptimized = performance.now();
const resultOptimized = findFolderByName_Optimized(bookmarks, targetName);
const endOptimized = performance.now();
const timeOptimized = endOptimized - startOptimized;

console.log(`Optimized Result found: ${resultOptimized ? 'Yes' : 'No'}`);
console.log(`Optimized Time: ${timeOptimized.toFixed(4)} ms`);

if (timeOriginal > 0) {
    console.log(`Improvement: ${(timeOriginal / timeOptimized).toFixed(2)}x faster`);
}
