// Converts list of JSON followers to CSV format
const fs = require('fs');
const followers = require('./ACCOUNT_USER_NAME_HERE/followers.js'); // Adjust the path if necessary

// Escapes special characters for CSV format
const escapeCsv = (str) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        // Double quotes are escaped with two double quotes
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

// Function to convert JSON array to CSV
const jsonToCsv = (data) => {
    const csvRows = [
        'username,full_name', // Header row
    ];

    // Convert each item to a CSV row, escaping special characters
    data.forEach(item => {
        const escapedUsername = escapeCsv(item.username);
        const escapedFullName = escapeCsv(item.full_name);
        csvRows.push(`${escapedUsername},${escapedFullName}`);
    });

    return csvRows.join('\n');
};

const csvData = jsonToCsv(followers);

// Save the CSV data to a file
fs.writeFile('followers.csv', csvData, (err) => {
    if (err) {
        console.error('Error writing to CSV file', err);
    } else {
        console.log('Successfully wrote to followers.csv');
    }
});
