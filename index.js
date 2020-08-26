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
