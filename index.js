var width = 100;
var height = 100;

var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var data = []; // columns

for (var col = 0; col < width; col++) {
    data[col] = []
}

setupRefreshButton();
drawTable();

function setupRefreshButton() {
    var refreshButton = document.getElementById("refresh-button");

    refreshButton.onclick = function() {
        clearTable();
        drawTable();
    }
}

function clearTable() {
    var table = document.getElementById("spreadsheet");
    table.innerHTML = '';
}

function drawTable() {
    var table = document.getElementById("spreadsheet");

    // create column headers
    var header = document.createElement("thead");
    header.appendChild(document.createElement("th"))
    for (var col = 0; col < width; col++) {
        var headerCell = document.createElement("th");
        headerCell.append(columnLabel(col));
        header.appendChild(headerCell);
    }
    table.append(header)

    // create table
    for (var row = 0; row < height; row++) {
        var nextRow = document.createElement("tr");

        var rowLabel = document.createElement("th");
        rowLabel.append(row + 1);
        nextRow.appendChild(rowLabel);

        for (var col = 0; col < width; col++) {    
            var nextCell = document.createElement("td");
            nextCell.dataset.col = col;
            nextCell.dataset.row = row;

            nextCell.onclick = function(event) {
                var cellValue = prompt("Enter cell value:");
                setCellValue(event.target.dataset.col, event.target.dataset.col, cellValue);
            };
            
            if (data[col][row]) {
                nextCell.append(data[col][row].value);
            }
            
            nextRow.appendChild(nextCell);
        }

        table.appendChild(nextRow);
    }
}

function setCellValue(col, row, value) {
    if (!data[col][row]) {
        data[col][row] = {}
    }
    data[col][row].value = value;
}

function columnLabel(count) {
    var firstLetter = '';
    var firstLetterIndex = Math.floor(count / 26);

    if (firstLetterIndex > 0) {
        firstLetter = alphabet[firstLetterIndex - 1];
    }

    var secondLetterIndex = count % alphabet.length;
    var secondLetter = alphabet[secondLetterIndex]

    return firstLetter + secondLetter;
}