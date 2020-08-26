var width = 100;
var height = 100;

var data = []; // columns

for (var col = 0; col < width; col++) {
    data[col] = []
}

data[3][4] = { value: 3 };
data[4][4] = { value: 4 };

drawTable();

function drawTable() {
    var table = document.getElementById("spreadsheet");

    for (var row = 0; row < height; row++) {
        var nextRow = document.createElement("tr");

        var rowLabel = document.createElement("th");
        rowLabel.append(row + 1);
        nextRow.appendChild(rowLabel);

        for (var col = 0; col < width; col++) {    
            var nextCell = document.createElement("td");
            
            if (data[col][row]) {
                nextCell.append(data[col][row].value);
            }
            
            nextRow.appendChild(nextCell);
        }

        table.appendChild(nextRow);
    }
}

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

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