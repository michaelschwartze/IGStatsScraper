const loadProfileButton = document.getElementById('load-profile');

loadProfileButton.addEventListener('click', function(){
    loadProfile();
})

function loadProfile() {
    console.log("loading profile...")
}

function fetchReels(){
    document.querySelectorAll("._abq3._al5p").forEach(div => {
        // Extract the href attribute value
        let href = div.querySelector("a").getAttribute("href");
    
        // Extract the image URL from the inline style
        let style = div.querySelector("div[style]").style.backgroundImage;
        let imageUrl = style.slice(style.indexOf('("') + 2, style.indexOf('")'));
    
        // Extract the specific number (assuming it's the last span with class 'html-span')
        let spans = div.querySelectorAll("span.html-span");
        let number = spans[spans.length - 1].textContent;
    
        // Log the extracted information to the console
        console.log({ href, imageUrl, number });
    });
    
}