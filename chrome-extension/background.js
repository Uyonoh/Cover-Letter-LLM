if (!chrome.storage) {
  console.error("chrome.storage is not available - check manifest permissions");
}

// Debug flag for development
const DEBUG = true;

// Create or update context menu
function setupContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create(
      {
        id: "captureText",
        title: "📋 Capture Text", // Added emoji for better visibility
        contexts: ["selection"],
      },
      () => {
        if (chrome.runtime.lastError) {
          DEBUG &&
            console.error("Menu creation error:", chrome.runtime.lastError);
        } else {
          DEBUG && console.log("Context menu created successfully");
        }
      }
    );
  });
}

function saveText(text) {
  // Safe storage usage
  try {
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ lastCapturedText: text }, () => {
        if (chrome.runtime.lastError) {
          console.error("Storage error:", chrome.runtime.lastError);
        } else {
          console.log("Text saved to storage");
        }
      });
    } else {
      console.warn(
        "chrome.storage.local not available - running without storage"
      );
    }
  } catch (err) {
    console.error("Error accessing storage:", err);
  }
}

// Initialize context menu on install/update
chrome.runtime.onInstalled.addListener(setupContextMenu);

// Recreate menu if Chrome updates
chrome.runtime.onStartup.addListener(setupContextMenu);

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  DEBUG && console.log("Context menu clicked:", info);

  if (info.menuItemId === "captureText" && info.selectionText) {
    const cleanedText = info.selectionText.trim();
    DEBUG && console.log("Captured text:", cleanedText);

    // 1. Save to storage (optional)
    saveText(cleanedText);

    // 2. Make API call directly from background script
    try {
      const apiResponse = await generateLetter(cleanedText);
      DEBUG && console.log("API response:", apiResponse);

      // 3. Send results to content script if needed
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: "apiResult",
          result: apiResponse,
        });
      }
    } catch (error) {
      console.error("API call failed:", error);
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: "apiError",
          error: error.message,
        });
      }
    }
  }
});

// API Call Function
async function generateLetter(jobDescription) {
  const apiUrl = "http://127.0.0.1:8000/letters/generate-letter";
  try {
    // Get both values in parallel
    const [tokenResult, textResult] = await Promise.all([
      chrome.storage.local.get("token"),
      chrome.storage.local.get("lastCapturedText"),
    ]);

    const token = tokenResult.token;
    // const jobDescription = textResult.lastCapturedText;

    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!jobDescription) {
      throw new Error("No job description available");
    }

    const payload = {
      job_description: jobDescription,
      // Add other required parameters
    };
    console.log("Payload:", payload);
    // return true;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error generating letter:", error);
    throw error; // Re-throw to allow caller to handle
  }
}

// Simplify the message handler (remove the nested then/catch)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchSelectedText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        sendResponse({ error: "No active tab found" });
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ["content.js"],
        },
        () => {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "getSelectedText" },
            (response) => {
              sendResponse(response || { text: "" });
              generateLetter(response.text);
              saveText(response.text || "");
            }
          );
        }
      );
    });
    
    return true; // Keep message channel open
  }
});

// Keep service worker alive (optional)
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20000);
keepAlive();
