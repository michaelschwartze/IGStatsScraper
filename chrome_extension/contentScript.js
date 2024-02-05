chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "scrapeData") {
    const reelMetricsUpdate = createReelMetricsUpdate();
    // Send scraped data to background script
    chrome.runtime.sendMessage({ type: "dataScraped", data: reelMetricsUpdate });
  } else if (request.action == "addReel") {
    const newReel = createNewReel();

    console.log(newReel)
  }
  
});

function createNewReel() {
    new_reel = {
        "post_date": null,
        "duration_in_seconds": null,
        "instagram_id": null
    }
    
    // get instagram id and add to object
    var reelUrl = window.location.href;
    var instagramId = reelUrl.endsWith('/') ? reelUrl.slice(0, -1).split('/').pop() : reelUrl.split('/').pop();
    new_reel.instagram_id = instagramId;

    // scrape post date and add to object
    const allTextSpans = document.querySelectorAll('span[data-bloks-name="bk.components.Text"]');
    for (let span of allTextSpans) {
        if (span.textContent.includes("Duration")) {
        const durationText = span.textContent;
        let searchString = " · Duration";
        let index = durationText.indexOf(searchString);
        let dateString = durationText.substring(0,index);
        new_reel.post_date = dateString;
        break;
        }
    }

    // scrape duration and add to object
    for (let span of allTextSpans) {
        if (span.textContent.includes("Duration")) {
          const durationText = span.textContent;
          const durationMatch = durationText.match(/Duration\s*(\d+:\d+)/);
          if (durationMatch && durationMatch[1]) {
            const duration = convertTimeToSeconds(durationMatch[1]);
            new_reel.duration_in_seconds = duration;
            break;
          }
        }
      }

    // return object
    return new_reel;

}

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

  // div that contains all the metrics
  const flexboxDivs = Array.from(document.querySelectorAll('div[data-bloks-name="bk.components.Flexbox"]'));
  const reachDiv = flexboxDivs.find(div => div.textContent.includes('Reach'));

  // Process reach metrics
  processReachMetrics(reachDiv, metricsData);

  // get: 
  //  initial_plays_count, replays_count, watch_time_in_seconds, average_watch_time_in_seconds, likes_count,
  //  comments_count, shares_count, saves_count
  for (let metric of metricsData) {
      for (let div of flexboxDivs) {
          const labelSpan = div.querySelector(`span[aria-label="${metric.scraping_label}"]`);
          if (labelSpan) {
              const valueDiv = labelSpan.closest('div[data-bloks-name="bk.components.Flexbox"]').nextElementSibling;
              const valueSpan = valueDiv ? valueDiv.querySelector('span[data-bloks-name="bk.components.Text"]') : null;
              if (valueSpan) {
                  let value = valueSpan.textContent.replace(/,/g, '').trim();
                  if (metric.scraping_label === "Watch time" || metric.scraping_label === "Average watch time") {
                      value = convertTimeToSeconds(value);
                  } else {
                      value = parseInt(value);
                  }
                  metric.updated_value = value;
                  break;
              }
          }
      }
  }

  // Populate update_collection
  reel_metrics_update.metric_update.update_collection = metricsData.reduce((acc, metric) => {
      acc[metric.output_label] = metric.updated_value;
      return acc;
  }, {});

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
  return reel_metrics_update;

}

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



function processReachMetrics(reachDiv, metricsData) {
  if (reachDiv) {
      const followersMetric = metricsData.find(m => m.scraping_label === "Followers");
      const nonFollowersMetric = metricsData.find(m => m.scraping_label === "Non-followers");

      const followersValue = reachDiv.querySelector('div[aria-label*="Followers"] span[data-bloks-name="bk.components.Text"]');
      const nonFollowersValue = reachDiv.querySelector('div[aria-label*="Non-followers"] span[data-bloks-name="bk.components.Text"]');

      if (followersValue && followersMetric) {
          followersMetric.updated_value = parseInt(followersValue.textContent.replace(/,/g, '').trim());
      }

      if (nonFollowersValue && nonFollowersMetric) {
          nonFollowersMetric.updated_value = parseInt(nonFollowersValue.textContent.replace(/,/g, '').trim());
      }
  }
}

