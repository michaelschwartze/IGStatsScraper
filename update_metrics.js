function convertRangeToObject() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("update"); // Target the sheet named "update"
  if (!sheet) {
    Logger.log("Sheet 'update' not found");
    return;
  }

  var lastRow = sheet.getLastRow();
  var range = sheet.getRange("A1:B" + lastRow); // Dynamic range based on the "update" sheet
  var values = range.getValues();

  var object = {};
  for (var i = 0; i < values.length; i++) {
    var key = values[i][0];   // First column
    var value = values[i][1]; // Second column

    // Skip empty rows
    if (key !== '' && value !== '') {
      object[key] = value;
    }
  }

  Logger.log(object);
  range.clearContent();

  return object;
}

function getReelUrl(updatedStatsObj) {
  // gets the URL from the update object
  if("Reel URL" in updatedStatsObj) {
    var reelUrl = updatedStatsObj["Reel URL"];
    Logger.log(reelUrl);
    return reelUrl;
  } else {
    Logger.log("Not found");
    return null;
  }
}

function updateReelStats(updatedStatsObj) {
  var reelUrl = getReelUrl(convertRangeToObject());
}