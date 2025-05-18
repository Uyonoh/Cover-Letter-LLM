if (!chrome.storage) {
    console.error('chrome.storage is not available - check manifest permissions');
  }

// Debug flag for development
const DEBUG = true;

// Create or update context menu
function setupContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "captureText",
      title: "📋 Capture Text", // Added emoji for better visibility
      contexts: ["selection"]
    }, () => {
      if (chrome.runtime.lastError) {
        DEBUG && console.error("Menu creation error:", chrome.runtime.lastError);
      } else {
        DEBUG && console.log("Context menu created successfully");
      }
    });
  });
}

// Initialize context menu on install/update
chrome.runtime.onInstalled.addListener(setupContextMenu);

// Recreate menu if Chrome updates
chrome.runtime.onStartup.addListener(setupContextMenu);

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  DEBUG && console.log("Context menu clicked:", info);
  
  if (info.menuItemId === "captureText" && info.selectionText) {
    const cleanedText = info.selectionText.trim();
    DEBUG && console.log("Captured text:", cleanedText);
    
    // Safe storage usage
    try {
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ lastCapturedText: cleanedText }, () => {
          if (chrome.runtime.lastError) {
            console.error("Storage error:", chrome.runtime.lastError);
          } else {
            console.log("Text saved to storage");
          }
        });
      } else {
        console.warn("chrome.storage.local not available - running without storage");
      }
    } catch (err) {
      console.error("Error accessing storage:", err);
    };
    
    // Send to all extension parts
    chrome.runtime.sendMessage({
      action: "textCaptured",
      text: cleanedText,
      tabId: tab.id
    }).catch(err => {
      DEBUG && console.log("No listeners for this message", err);
    });
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchSelectedText") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (!tabs[0]) {
        sendResponse({error: "No active tab found"});
        return;
      }
      
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: ['content.js']
      }).then(() => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {action: "getSelectedText"},
          (response) => {
            if (chrome.runtime.lastError) {
              DEBUG && console.error("Message error:", chrome.runtime.lastError);
              sendResponse({error: "Content script not responding"});
            } else {
              sendResponse(response || {text: ""});
            }
          }
        );
      }).catch(err => {
        DEBUG && console.error("Injection error:", err);
        sendResponse({error: "Script injection failed"});
      });
    });
    return true; // Keep message channel open
  }
  
  // Add more message handlers as needed
});

// Keep service worker alive (optional)
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20000);
keepAlive();