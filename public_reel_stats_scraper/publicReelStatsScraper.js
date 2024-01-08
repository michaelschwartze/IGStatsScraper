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
    reelObj['Link'] = 'instagram.com' + href;
    reelObj['Thumbnail'] = '=image("' + imageUrl + '")';
    reelObj['Plays'] = playsNumeric;

    return reelObj
}

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
                        console.log(divs);
                        // TODO
                            // For each element in the divs array 
                                // Create Reel Object using the createReelObjectFromDiv function 
                                // Check if it exists in the Reels Array by it's ID attribute using the containsObjectWithUniqueProperty function
                                // If it doesn't exist, add it to the reelsArray
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

// Run the full process
function grabStats(){
    var reelsArray = [];                                        // Create an empty reels array
    console.log(reelsArray)
    var initialReelsArray = getInitialReelsIndex();             // get the reels that show up on page load
    Array.prototype.push.apply(reelsArray, initialReelsArray);  // Add the initial reels to the reels array
    observeDivAppends()                                         // start the div append observer
}