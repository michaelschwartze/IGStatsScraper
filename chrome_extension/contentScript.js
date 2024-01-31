chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "scrapeData") {
      const scrapedData = {
        "metric_update": {
          "instagram_id": "C1cy_05p5fZ",
          "recorded_at": "2024-01-01",
          "update_collection": {
            "average_watch_time_in_seconds": 5,
            "watch_time_in_seconds": 100,
            "initial_plays_count": 10,
            "replays_count": 5,
            "likes_count": 14,
            "comments_count": 10,
            "shares_count": 2,
            "saves_count": 0,
            "follower_accounts_reached_count": 2,
            "non_follower_accounts_reached_count": 3
          }
        }
      }
      // Send scraped data to background script
      chrome.runtime.sendMessage({ type: "dataScraped", data: scrapedData });
  }
});
