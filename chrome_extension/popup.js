document.getElementById('execute-script').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: pageScript,
    });
  });
  
  function pageScript() {
    // Your code to execute on the page goes here
    let jsonData = findMetrics();
    generateTable(jsonData)
  }
  