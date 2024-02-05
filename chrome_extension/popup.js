// listen 
document.getElementById('scrapeButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeData" });
    });
});

document.getElementById('addReel').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var accountSelect = document.getElementById('accountSelect');
        var selectedAccount = accountSelect.value; // Correct variable name
        chrome.tabs.sendMessage(tabs[0].id, { action: "addReel", accountName: selectedAccount }); // Use selectedAccount here
    });
});



