chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'https://www.instagram.com/mschwartze/reels/' });
});