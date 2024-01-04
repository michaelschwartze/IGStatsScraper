

function copyTableToClipboard(tableId) {
    var table = document.getElementById(tableId);
    var range, selection;

    if (document.createRange && window.getSelection) {
        range = document.createRange();
        selection = window.getSelection();
        selection.removeAllRanges();

        try {
            range.selectNodeContents(table);
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();

            console.log('Table copied to clipboard');
        } catch (e) {
            console.log('Unable to copy table to clipboard', e);
        }
    }
}


