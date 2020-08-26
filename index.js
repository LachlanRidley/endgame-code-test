var width = 100;
var height = 100;

var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var data = []; // columns

var formulas = {
    '+': function(left, right) {
        return parseInt(left) + parseInt(right);
    },
    '-': function(left, right) {
        return parseInt(left) - parseInt(right);
    },
    '*': function(left, right) {
        return parseInt(left) * parseInt(right);
    },
    '/': function(left, right) {
        return parseInt(left) / parseInt(right);
    }
    ,
    '%': function(left, right) {
        return parseInt(left) % parseInt(right);
    }
}

for (var col = 0; col < width; col++) {
    data[col] = []
}

setCellValue(1, 1, 2);
setCellValue(2, 1, 3);
setCellValue(3, 1, "=B2+C2");
setCellValue(3, 2, "=C2+D2");
setCellValue(3, 3, "=B2-C2");
setCellValue(3, 4, "=B2*C2");
setCellValue(3, 5, "=B2/C2");
setCellValue(3, 6, "=C2%B2");

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

function handleCellClick(event) {
    var cellValue = prompt("Enter cell value:");
    setCellValue(event.target.dataset.col, event.target.dataset.row, cellValue);
};

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
            nextCell.onclick = handleCellClick;
            nextCell.append(getCellValue(col, row));
            
            nextRow.appendChild(nextCell);
        }

        table.appendChild(nextRow);
    }
}

function cell(cellReference) {
    var letterComponent = cellReference.charAt(0);
    var numberComponent = cellReference.charAt(1);

    var col = alphabet.findIndex(function(letter) {
        return letter === letterComponent;
    });

    var row = parseInt(numberComponent) - 1;

    return data[col][row];
}

function setCellValue(col, row, value) {
    if (!data[col][row]) {
        data[col][row] = {}
    }
    data[col][row].value = value;
}

function getCellValue(col, row) {
    if (!data[col][row]) {
        return '';
    }

    var cellValue = data[col][row].value.toString();

    if (cellValue.charAt(0) === '=') {
        cellValue = calculateFormula(cellValue.toString());   
    }

    return cellValue;
}

function calculateFormula(formula) {
    if (formula.charAt(0) !== '=') {
        return formula;
    }

    var result;

    var index = 1;
    var leftCellReference = '';
    while (index < formula.length) {
        if (formula.charAt(index).match(/^[0-9a-zA-Z]+$/)) {
            leftCellReference += formula.charAt(index).toUpperCase();
        } else {
            break;
        }

        index++;
    }

    var operator = formula.charAt(index);
    
    index++;
    
    var rightCellReference = '';
    while (index < formula.length) {
        if (formula.charAt(index).match(/^[0-9a-zA-Z]+$/)) {
            rightCellReference += formula.charAt(index).toUpperCase();
        } else {
            break;
        }

        index++;
    }
    
    console.log({leftCellReference, operator, rightCellReference});

    if (operator in formulas) {
        var calculatedLeft = calculateFormula(cell(leftCellReference).value.toString());
        var calculatedRight = calculateFormula(cell(rightCellReference).value.toString());

        result = formulas[operator](calculatedLeft, calculatedRight);
    }

    return result;
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