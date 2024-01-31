// Listener for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Process message from content script
    // Example: Sending data to your server
    console.log("Data received from content script:", message);
  
    // Placeholder for sending data to the server
    // fetch('your_server_endpoint', { /* fetch options go here */ })
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error:', error));
  
    // Placeholder response back to content script, if needed
    // sendResponse({ status: "Data processed by background script" });
  
    // Return true to indicate you wish to send a response asynchronously (optional)
    return true;
  });
  