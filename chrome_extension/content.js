/**
 * IG Reel Insights Extraction Script
 * Version: 1.1.0
 * Last Updated: 2023-12-29
 * Description: Extracts key metrics from Instagram Reel insights, including followers, non-followers, and various engagement metrics.
 */

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
  
  function findMetrics() {
    const metrics = [];
    const labels = ["Plays", "Watch time", "Average watch time", "Accounts reached", "Initial plays", "Replays", "Likes", "Comments", "Shares", "Saves"];
  
    // Locate the Reach div and its children
    const flexboxDivs = Array.from(document.querySelectorAll('div[data-bloks-name="bk.components.Flexbox"]'));
    const reachDiv = flexboxDivs.find(div => div.textContent.includes('Reach'));
  
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
  
    // Process other metrics
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
  
    // Find and process the Duration metric
    const allTextSpans = document.querySelectorAll('span[data-bloks-name="bk.components.Text"]');
    for (let span of allTextSpans) {
      if (span.textContent.includes("Duration")) {
        const durationText = span.textContent;
        const durationMatch = durationText.match(/Duration\s*(\d+:\d+)/);
        if (durationMatch && durationMatch[1]) {
          const duration = convertTimeToSeconds(durationMatch[1]);
          metrics.push(["Duration", duration]);
          break;
        }
      }
    }

    // Find and process the Post Date metric
    // const allTextSpans = document.querySelectorAll('span[data-bloks-name="bk.components.Text"]');
    for (let span of allTextSpans) {
      if (span.textContent.includes("Duration")) {
        const durationText = span.textContent;
        let searchString = " · Duration";
        let index = durationText.indexOf(searchString);
        let dateString = durationText.substring(0,index);
        metrics.push(["Post Date", dateString]);
        break;
      }
    }   

    // Add the Reel URL to the array
    metrics.push(["Reel URL", window.location.href ])

    function arrayToObj(arr) {
      return arr.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
      
    }

    const resultString = arrayToObj(metrics);

    console.log(resultString);

    return metrics.length > 0 ? metrics : "Metrics not found.";




  }
  
 