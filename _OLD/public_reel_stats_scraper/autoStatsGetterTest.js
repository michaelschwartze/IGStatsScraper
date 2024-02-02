// From the reels index page, after clicking on the first reel thumbnail and opening the modal

// ***** PART 1 > START
// Set the insights modal to closed
let insightsModalOpen = false;

// Identify the view insights button
function findViewInsightsButton() {
    let buttons = document.querySelectorAll('[role="button"]');
    for (let button of buttons) {
        if (button.textContent.trim() === 'View insights') {
            return button;
        }
    }
    return null; // Return null if no matching button is found
}

// Create the view insights button variable
let viewInsightsButton = findViewInsightsButton();

//  Setup a script to detect when the insights modal has been opened
let insightsModalListener;
let insightsModalListenerRunning = false;

function startInsightsModalListener() {
    if (!insightsModalListenerRunning) {
        insightsModalListener = setInterval(function() {
            let elementExists = Array.from(document.querySelectorAll('span[data-bloks-name="bk.components.Text"]')).some(span => span.textContent.includes('Duration')); // checks that the element is not null, i.e. it exists
            insightsModalOpen = elementExists;
        }, 100);
        insightsModalListenerRunning = true;
        console.log("Insights Modal Listener started.");
    } 
}

function stopInsightsModalListener() {
    if (insightsModalListenerRunning) {
        clearInterval(insightsModalListener);
        insightsModalListenerRunning = false;
        console.log("Insights Modal Listener stopped.");
    } else {
        console.log("Insights Modal Listener is not running.");
    }
}

// Scrape the insights (this code is pulled from the original /chrome_extension/content.js script )
// Helpers
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
  
function arrayToObj(arr) {
    return arr.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
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
  
    let jsonDataObject = arrayToObj(metrics);
  
    //return metrics.length > 0 ? metrics : "Metrics not found.";
  
    console.log(metrics);
    return jsonDataObject

}

function closeInsightsModal(buttons){
  // Identify the close insights modal button
  let insightsModalCloseButton = Array.from(buttons).find(button => {
    return button.querySelector('svg[aria-label="Close"]');
  });
  insightsModalCloseButton.click(); // Close the insights modal
}

function navigateToNextReel(){
  // Identify the carousel next button
  let carouselNextButton = Array.from(buttons).find(button => {
    return button.querySelector('svg[aria-label="Next"]');
  });

  carouselNextButton.click();
}


function runStatsGetter(){
  startInsightsModalListener();
  viewInsightsButton.click();

  let checkModalOpenInterval = setInterval(function() {
      if (insightsModalOpen) {
          clearInterval(checkModalOpenInterval);
          stopInsightsModalListener();
          findMetrics();
          let buttons = document.querySelectorAll('button._abl-');
          closeInsightsModal(buttons);
          navigateToNextReel(buttons);
      }
  }, 100);

  // TODO: reset everything
};

runStatsGetter()