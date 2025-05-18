// Function to get highlighted text
function getSelectedText() {
    return window.getSelection().toString().trim();
  }
  
  // Listen for messages from the extension
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSelectedText") {
      const selectedText = getSelectedText();
      sendResponse({text: selectedText});
    }
    return true; // Required for async response
  });