// **************************
// SETUP

var reelsArray = []; // create an empty array for the Reels Objects

var additionalReels = 0;

// **************************
// INITIAL REELS LOADER
// from the initial page load, grabs the displayed reels and adds them to the Reels Array

function getInitialReelsIndex(){
    var initialReelsArray = [];                      // create return object
    document.querySelectorAll("._abq3._al5p").forEach(div => {
        var reelObj = createReelObjectFromDiv(div);
        initialReelsArray.push(reelObj)
    });
    return initialReelsArray;
}

function createReelObjectFromDiv(div){
    var reelObj = {};        
    let href = div.querySelector("a").getAttribute("href");     // Extract the href attribute value
    
    // Extract the image URL from the inline style
    let style = div.querySelector("div[style]").style.backgroundImage;
    let imageUrl = style.slice(style.indexOf('("') + 2, style.indexOf('")'));   

    // Extract the specific number (assuming it's the last span with class 'html-span')
    let spans = div.querySelectorAll("span.html-span");
    let playsAsText = spans[spans.length - 1].textContent;
    let playsNumeric = parseNumberFromString(playsAsText);
    
    // Extract the Reel ID
    let reelID = extractReelId(href);
        
    // Add extracted information to the reel object
    reelObj['ID'] = reelID;
    reelObj['Reel URL'] = 'instagram.com' + href;
    reelObj['Thumbnail'] = '=image("' + imageUrl + '")';
    reelObj['Plays'] = playsNumeric;

    return reelObj
}

// **************************
// DIV APPEND OBSERVER & AUTO SCROLLER 
// automatically scrolls the webpage to trigger calls to the IG server that return more reels and append them to the document

function observeDivAppends() {
    // Define the classes to look for
    const targetClasses = ['_ac7v', '_al5r'];

    // Create an observer instance
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // Check if it's a DIV and has the target classes
                    if (node.nodeName === 'DIV' && targetClasses.every(cls => node.classList.contains(cls))) {
                        const childDivs = node.querySelectorAll("._abq3._al5p");
                        let divs = Array.from(childDivs);

                        divs.forEach(div => {
                            let href = div.querySelector("a").getAttribute("href"); 
                            let reelId = extractReelId(href);
                            if (containsID(reelsArray, reelId)){
                                console.log("don't add " + reelId);
                            } else {
                                let reelObj = createReelObjectFromDiv(div);
                                reelsArray.push(reelObj);     
                            }

                            // TODO using the reelId, check if the reel exists in the reelsArray
                                // If it doesn't, create a reelObject from the div and add it to the reels Array
                                // otherwise do nothing

                        });
                    }
                });
            }
        });
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true };

    // Start observing the body for appended divs
    observer.observe(document.body, config);
}

const scrollSpeed = 125; // Replace X with your desired scrolling speed in pixels per second

function scrollPage() {
  const scrollDistance = scrollSpeed * 0.05; // Calculate scroll distance for a 50ms interval
  window.scrollBy(0, scrollDistance); // Scroll by the calculated distance
  requestAnimationFrame(scrollPage); // Request the next animation frame
}

// TODO: finish the stop scrolling function
// observe scroll speed to stop scrolling 

let observedScrollSpeed = 0;
let scrollCount = 0;

function calculateScrollSpeed() {
  const scrollTop = window.scrollY;
  setTimeout(() => {
    const newScrollTop = window.scrollY;
    const scrollDistance = Math.abs(newScrollTop - scrollTop);
    const timeElapsed = 5 * 1000; // 5 seconds in milliseconds
    const speed = scrollDistance / timeElapsed; // Calculate speed in pixels per millisecond
    observedScrollSpeed = speed * 1000; // Convert to pixels per second
    scrollCount++;
    console.log(`Average Scroll Speed (last 5 seconds): ${observedScrollSpeed.toFixed(2)} pixels/second`);
    calculateScrollSpeed(); // Recursively call the function every 5 seconds
  }, 5000); // Wait for 5 seconds before calculating again
}

// **************************


// printPublicReelsStatsTable

function printPublicReelsStatsTable(reelsArray){
    let tableString = "";

    // Add header row
    tableString += Object.keys(reelsArray[0]).join("\t") + "\n";

    // Add data rows
    reelsArray.forEach(row => {
    tableString += Object.values(row).join("\t") + "\n";

    });

    console.log(tableString);
}

// HELPER FUNCTIONS

function parseNumberFromString(str) {
    // Remove commas
    let value = str.replace(/,/g, "");

    // Check for 'K' (thousands) and 'M' (millions)
    if (value.toLowerCase().endsWith('k')) {
        value = parseFloat(value) * 1000;
    } else if (value.toLowerCase().endsWith('m')) {
        value = parseFloat(value) * 1000000;
    } else {
        // If no 'K' or 'M', parse it as a regular number
        value = parseFloat(value);
    }

    return Math.round(value); // Round to the nearest integer
}

function extractReelId(url){
    const regex = /\/reel\/([A-Za-z0-9_\-]+)\//;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function containsID(array, id) {
    return array.some(item => item.ID === id);
}

function containsObjectWithUniqueProperty(targetArray, myObject, myProperty) {
    // Check if the object has myProperty
    if (myObject.hasOwnProperty(myProperty)) {
        // Check if any object in the array has the same property value
        const exists = targetArray.some(item => item[myProperty] === myObject[myProperty]);

        // Return false if the object exists (not unique), true otherwise (unique)
        return !exists;
    } else {
        console.error(`Object must have the property '${myProperty}'`);
        return false;
    }
}

// **************************
// RUN THE PROCESS

var initialReelsArray = getInitialReelsIndex();             // get the reels that show up on page load
Array.prototype.push.apply(reelsArray, initialReelsArray);  // Add the initial reels to the reels array
observeDivAppends()                                         // start the div append observer
scrollPage()

// **************************