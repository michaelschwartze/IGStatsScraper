chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "dataScraped") {
      console.log("Scraped data received:", message.data);
      // Add logic to send this data to your Rails backend
      const metricsUpdate = message.data;
      sendMetricsData(metricsUpdate);
  }
});


// *****

async function sendMetricsData(metricsUpdate) {
  const url = 'http://localhost:3000/api/update_metrics'; // Replace with your API endpoint
  const serializedData = JSON.stringify(metricsUpdate);

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: serializedData
      });

      if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Success:', jsonResponse);
          // Additional success handling
      } else {
          console.error('HTTP Error:', response.status);
          // Additional error handling
      }
  } catch (error) {
      console.error('Fetch Error:', error);
      // Additional error handling
  }
}