chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "dataScraped") {
      console.log("Scraped data received:", message.data);
      // Add logic to send this data to your Rails backend
  }
});
