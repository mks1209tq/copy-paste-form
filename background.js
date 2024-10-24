const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

function sendMessageWithRetry(tabId, message, retries = 0) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, response => {
      if (chrome.runtime.lastError) {
        console.error(`Attempt ${retries + 1} failed:`, chrome.runtime.lastError.message);
        if (retries < MAX_RETRIES) {
          setTimeout(() => {
            sendMessageWithRetry(tabId, message, retries + 1)
              .then(resolve)
              .catch(reject);
          }, RETRY_DELAY);
        } else {
          reject(new Error("Max retries reached. Failed to connect to form2."));
        }
      } else {
        resolve(response);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "transferData") {
    const form2Url = "https://tanseeq1209.test/form2"; // Replace with your actual Form2 URL
    chrome.tabs.query({url: form2Url}, tabs => {
      if (tabs.length > 0) {
        sendMessageWithRetry(tabs[0].id, {action: "fillForm2", data: request.data})
          .then(response => {
            console.log("Data sent to form2:", response);
            sendResponse({success: true});
          })
          .catch(error => {
            console.error("Error sending message to form2:", error.message);
            sendResponse({success: false, error: error.message});
          });
      } else {
        console.error("Form2 tab not found");
        sendResponse({success: false, error: "Form2 tab not found"});
      }
    });
    return true; // Indicates we will send a response asynchronously
  }
});