
// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSelectedText") {
    sendResponse({ text: window.getSelection().toString().trim() });
  }
  if (message.action === "apiResult") {
    // Handle successful API response
    console.log("Received API result:", message.result);
  }
  if (message.action === "apiError") {
    // Handle API errors
    console.error("API error:", message.error);
  }
  return true;
});