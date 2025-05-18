document.getElementById('captureBtn').addEventListener('click', async () => {
    try {
      const response = await chrome.runtime.sendMessage({action: "fetchSelectedText"});
      document.getElementById('result').textContent = 
        response?.text || "No text highlighted";
    } catch (error) {
      console.error("Error:", error);
      document.getElementById('result').textContent = "Error capturing text";
    }
  });