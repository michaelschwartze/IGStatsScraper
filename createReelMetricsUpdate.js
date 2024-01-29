function createReelMetricsUpdate() {
    reel_metrics_update = {
        "metric_update": {
            "instagram_id": null,
            "recorded_at": null,
            "update_collection": {}
        }
    };

    // get instagram reel ID
    var reelUrl = window.location.href;
    var instagramId = reelUrl.endsWith('/') ? reelUrl.slice(0, -1).split('/').pop() : reelUrl.split('/').pop();
    reel_metrics_update.metric_update.instagram_id = instagramId;

    // generate recorded at date (format?)
    var now = new Date();
    var estOffset = -5; // EST is UTC-5
    var utc = now.getTime() + (now.getTimezoneOffset() * 60000); // Convert to UTC
    var est = new Date(utc + (3600000 * estOffset)); // Convert UTC to EST
    
    // Format to YYYY-MM-DD
    var dateString = est.getFullYear() + '-' +
                     ('0' + (est.getMonth() + 1)).slice(-2) + '-' + // Months are 0-based
                     ('0' + est.getDate()).slice(-2);
    
    reel_metrics_update.metric_update.recorded_at = dateString;

    // setup array to get/receive updated merics    
    const metricsData = [
        {
            "scraping_label": "Average watch time",
            "output_label": "average_watch_time_in_seconds",
            "updated_value": null 
        },
        {
            "scraping_label": "Watch time",
            "output_label": "watch_time_in_seconds",
            "updated_value": null 
        },
        {
            "scraping_label": "Initial plays",
            "output_label": "initial_plays_count",
            "updated_value": null 
        },
        {
            "scraping_label": "Replays",
            "output_label": "replays_count",
            "updated_value": null 
        },
        {
            "scraping_label": "Likes",
            "output_label": "likes_count",
            "updated_value": null 
        },
        {
            "scraping_label": "Comments",
            "output_label": "comments_count",
            "updated_value": null 
        },
        {
            "scraping_label": "Shares",
            "output_label": "shares_count",
            "updated_value": null 
        },
        {
            "scraping_label": "Saves",
            "output_label": "saves_count",
            "updated_value": null 
        },
        {
            "scraping_label": "Followers",
            "output_label": "follower_accounts_reached_count",
            "updated_value": null 
        },
        {
            "scraping_label": "Non-followers",
            "output_label": "non_follower_accounts_reached_count",
            "updated_value": null 
        },
    ];

    const metrics = [];
    const labels = ["Plays", "Watch time", "Average watch time", "Accounts reached", "Initial plays", "Replays", "Likes", "Comments", "Shares", "Saves"];
    
    // div that contains all the metrics
    const flexboxDivs = Array.from(document.querySelectorAll('div[data-bloks-name="bk.components.Flexbox"]'));
    const reachDiv = flexboxDivs.find(div => div.textContent.includes('Reach'));

    // get follower_accounts_reached_count, non_follower_accounts_reached_count
    if (reachDiv) {
        // Extract values for Followers and Non-followers
        const followersValue = reachDiv.querySelector('div[aria-label*="Followers"] span[data-bloks-name="bk.components.Text"]');
        const nonFollowersValue = reachDiv.querySelector('div[aria-label*="Non-followers"] span[data-bloks-name="bk.components.Text"]');
    
        if (followersValue) {
          metrics.push(["Followers", parseInt(followersValue.textContent.replace(/,/g, '').trim())]);
        }
    
        if (nonFollowersValue) {
          metrics.push(["Non-followers", parseInt(nonFollowersValue.textContent.replace(/,/g, '').trim())]);
        }
    }
    
    // get: 
    //  initial_plays_count, replays_count, watch_time_in_seconds, average_watch_time_in_seconds, likes_count,
    //  comments_count, shares_count, saves_count
    for (let label of labels) {
        for (let div of flexboxDivs) {
          const labelSpan = div.querySelector(`span[aria-label="${label}"]`);
          if (labelSpan) {
            const valueDiv = labelSpan.closest('div[data-bloks-name="bk.components.Flexbox"]').nextElementSibling;
            const valueSpan = valueDiv ? valueDiv.querySelector('span[data-bloks-name="bk.components.Text"]') : null;
            if (valueSpan) {
              let value = valueSpan.textContent.replace(/,/g, '').trim();
              if (label === "Watch time" || label === "Average watch time") {
                value = convertTimeToSeconds(value);
              } else {
                value = parseInt(value);
              }
              metrics.push([label, value]);
              break;
            }
          }
        }
    }

    // time helper function
    function convertTimeToSeconds(timeStr) {
        // First, try parsing as "M:SS" format
        const minSecMatch = timeStr.match(/(\d+):(\d+)/);
        if (minSecMatch) {
          return parseInt(minSecMatch[1]) * 60 + parseInt(minSecMatch[2]);
        }
      
        // Fallback to the original parsing method
        const timeParts = timeStr.match(/(\d+)\s*hr|(\d+)\s*min|(\d+)\s*sec/g);
        let totalSeconds = 0;
      
        if (timeParts) {
          timeParts.forEach(part => {
            const value = parseInt(part);
      
            if (part.includes('hr')) {
              totalSeconds += value * 3600;
            } else if (part.includes('min')) {
              totalSeconds += value * 60;
            } else if (part.includes('sec')) {
              totalSeconds += value;
            }
          });
        }
      
        return totalSeconds;
    }

    

    // return the JSON object
    return reel_metrics_update

}