// HTML generation for the modal that displays the scraped stats
function generateTable(jsonData){

    // Clear existing modal

    let existingModal = document.getElementById('myModal');
    
    if (existingModal) {
        existingModal.parentNode.removeChild(existingModal);
    }


    let htmlStringBeginning = `
    <div id="myModal" style="display:none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); padding-top: 60px;">
        <div style="background-color: #fefefe; margin: 5% auto; padding: 20px; border: 1px solid #888; width: 400px;">
            <span id="closeModal" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
            <p style="text-align: center;">Reel Insights Table</p>
            <table id="reelsInsights" style='border: none;'>`;

    function htmlStringMiddle(jsonData) {
        let html = '';
        for (let key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                html += `<tr>
                            <th style="border: none; box-shadow: none; background-color: white;">${key}</th>
                            <td style="border: none; box-shadow: none; background-color: white;">${jsonData[key]}</td>
                        </tr>`;
            }
        }
        return html;
    }
   
    let htmlStringEnd = `</table><div style="display: flex; justify-content: center; padding-top: 30px; padding-bottom: 10px;">
                            <button id="copy-table" style="background: rgb(0, 149, 246); padding-left: 20px;
                            padding-right: 20px;
                            padding-bottom: 5px;
                            padding-top: 5px;
                            border: none;
                            color: white;
                            border-radius: 5px;">Copy</button>
                        </div></div></div>`;
    
    function modalHTML() {
        return htmlStringBeginning + htmlStringMiddle(jsonData) + htmlStringEnd;
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML());
    
    // Close Modal Function
    document.getElementById('closeModal').onclick = function() {
        document.getElementById('myModal').style.display = "none";
    }
    
    // Display Modal
    document.getElementById('myModal').style.display = 'block';

    // Add button listener
    document.getElementById('copy-table').addEventListener('click', function() {
        copyTableToClipboard('reelsInsights');
    });
    
}


