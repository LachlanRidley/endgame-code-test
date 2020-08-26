var width = 100;
var height = 100;

var data = []; // columns

for (var col = 0; col < width; col++) {
    data[col] = []
}

data[4][4] = 4;

drawTable();

function drawTable() {
    var table = document.getElementById("spreadsheet");

    for (var col = 0; col < width; col++) {
        var nextRow = document.createElement("tr");
        
        for (var row = 0; row < height; row++) {
            var nextCell = document.createElement("td");
            nextCell.append("Hello world!");
            nextRow.appendChild(nextCell);
        }

        table.appendChild(nextRow);
    }
}
