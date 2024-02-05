chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === "dataScraped") {
    console.log("Scraped data received: ", message.data);
    const metricsUpdate = message.data;
    sendMetricsData(metricsUpdate);
  } else if (message.type === "addReel", message.data){
    console.log("New reel received: ", message.data);
    const newReel = message.data;
    sendNewReelData(newReel);
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

async function sendNewReelData(newReel) {
    const url = 'http://localhost:3000/api/reels';
    const serializedData = JSON.stringify(newReel);

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