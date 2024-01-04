// HTML generation for the modal that displays the scraped stats
function generateTable(jsonData){

    let htmlStringBeginning = `
    <div id="myModal" style="display:none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); padding-top: 60px;">
        <div style="background-color: #fefefe; margin: 5% auto; padding: 20px; border: 1px solid #888; width: 80%;">
            <span id="closeModal" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
            <p>Reel Insights Table</p>
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
   
    let htmlStringEnd = `</table></div></div>`;
    
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
}


