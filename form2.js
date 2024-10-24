console.log("Form2 content script loaded");

function fillForm2(data) {
  return new Promise((resolve, reject) => {
    try {
      // Fill the form fields with the received data
      document.querySelector('#name').value = data.name || '';
      document.querySelector('#email').value = data.email || '';
      
      console.log("Form2 filled with data:", data);
      resolve({success: true});
    } catch (error) {
      console.error("Error filling Form2:", error);
      reject(error);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in form2:", request);
  if (request.action === "fillForm2") {
    fillForm2(request.data)
      .then(() => {
        console.log("Form2 filled successfully");
        sendResponse({success: true});
      })
      .catch(error => {
        console.error("Error filling Form2:", error);
        sendResponse({success: false, error: error.message});
      });
    return true; // Indicates we will send a response asynchronously
  }
});

// Notify that the content script is ready
function notifyReady() {
  chrome.runtime.sendMessage({action: "form2Ready"}, response => {
    console.log("Notified background script that form2 is ready");
  });
}

// Notify immediately when the script loads
notifyReady();

// Also notify when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', notifyReady);

// Add a mutation observer to check for dynamically loaded form
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      const form = document.querySelector('form[action="/documents"]');
      if (form) {
        console.log("Form detected in DOM");
        notifyReady();
        observer.disconnect();
        break;
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });