document.getElementById('captureBtn').addEventListener('click', async () => {
    try {
      const response = await chrome.runtime.sendMessage({action: "fetchSelectedText"});
      document.getElementById('job_description').textContent = 
        response?.text || "No text highlighted";
    } catch (error) {
      console.error("Error:", error);
      document.getElementById('job_description').textContent = "Error capturing text";
    }
  });