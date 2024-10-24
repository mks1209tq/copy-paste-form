// Content script for form1

function extractDataFromForm1() {
  return new Promise((resolve, reject) => {
    try {
      // Replace this with actual form field selectors and data extraction
      const data = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        // Add more fields as needed
      };
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

function handleTransfer() {
  extractDataFromForm1()
    .then(data => {
      console.log("Data extracted:", data);
      chrome.runtime.sendMessage({action: "transferData", data: data}, response => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          console.log("Message sent successfully:", response);
        }
      });
    })
    .catch(error => {
      console.error("Error extracting data:", error);
      alert("Error extracting data: " + error.message);
    });
}

// Add click event listener to the transfer button
const transferButton = document.querySelector('#transferButton');
if (transferButton) {
  transferButton.addEventListener('click', handleTransfer);
}