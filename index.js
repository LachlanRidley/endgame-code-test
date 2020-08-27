var width = 100;
var height = 100;

var alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

var data = []; // columns

for (var col = 0; col < width; col++) {
  data[col] = [];
}

setCellValue(1, 1, 2);
setCellValue(2, 1, 3);
setCellValue(3, 1, "=B2+C2");
setCellValue(3, 2, "=C2+D2");
setCellValue(3, 3, "=B2-C2");
setCellValue(3, 4, "=B2*C2");
setCellValue(3, 5, "=B2/C2");
setCellValue(3, 6, "=C2%B2");
setCellValue(3, 7, "=SUM(D2:D7)");

setCellValue(6, 1, 1);
setCellValue(7, 1, 2);
setCellValue(6, 2, 3);
setCellValue(7, 2, 4);
setCellValue(6, 3, "=SUM(G2:H3)");
setCellValue(7, 3, "=SUM(H3:G2)");
setCellValue(6, 4, "=AVERAGE(H3:G2)");

setCellValue(10, 1, 123, { bold: true });

setCellValue(99, 97, 4);
setCellValue(99, 98, 5);
setCellValue(99, 99, "=CV98+CV99");

let selectedCell = null;

document.getElementById("value-input").onblur = function () {
  const newValue = event.target.value;

  setCellValue(selectedCell.col, selectedCell.row, newValue);

  event.target.value = "";
};

document.getElementById("bold-button").onclick = function () {
  if (!data[selectedCell.col][selectedCell.row].options) {
    data[selectedCell.col][selectedCell.row].options = {};
  }
  data[selectedCell.col][selectedCell.row].options.bold = true;
};

document.getElementById("font-color-picker").onchange = function () {
  const color = event.target.value;

  if (!data[selectedCell.col][selectedCell.row].options) {
    data[selectedCell.col][selectedCell.row].options = {};
  }
  data[selectedCell.col][selectedCell.row].options.fontColor = color;
};

document.getElementById("background-color-picker").onchange = function () {
  const color = event.target.value;

  if (!data[selectedCell.col][selectedCell.row].options) {
    data[selectedCell.col][selectedCell.row].options = {};
  }
  data[selectedCell.col][selectedCell.row].options.backgroundColor = color;
};

setupRefreshButton();
drawTable();

function setupRefreshButton() {
  var refreshButton = document.getElementById("refresh-button");

  refreshButton.onclick = function () {
    clearTable();
    drawTable();
  };
}

function handleCellClick(event) {
  const col = event.target.dataset.col;
  const row = event.target.dataset.row;
  const cell = data[col][row];
  const defaultValue = cell ? cell.value : "";

  const cellValue = prompt("Enter cell value:", defaultValue);

  setCellValue(col, row, cellValue);

  selectedCell = {
    col: col,
    row: row,
  };

  document.getElementById("value-input").value = cellValue;
  event.target.classList.add("selected");
}

function clearTable() {
  var table = document.getElementById("spreadsheet");
  table.innerHTML = "";
}

function drawTable() {
  var table = document.getElementById("spreadsheet");

  // create column headers
  var header = document.createElement("thead");
  header.appendChild(document.createElement("th"));
  for (var col = 0; col < width; col++) {
    var headerCell = document.createElement("th");
    headerCell.append(columnLabel(col));
    header.appendChild(headerCell);
  }
  table.append(header);

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

      const cellData = data[col][row];

      if (cellData && cellData.options) {
        if (cellData.options.bold) {
          nextCell.classList.add("bold");
        }
        if (cellData.options.fontColor) {
          nextCell.style.color = cellData.options.fontColor;
        }
        if (cellData.options.backgroundColor) {
          nextCell.style.backgroundColor = cellData.options.backgroundColor;
        }
      }

      nextRow.appendChild(nextCell);
    }

    table.appendChild(nextRow);
  }
}

function cell(cellReference) {
  const [col, row] = getCellCoordinates(cellReference);

  return data[col][row];
}

function getCellCoordinates(cellReference) {
  let index = 0;

  var letterComponent = "";
  while (index < cellReference.length) {
    if (cellReference.charAt(index).match(/^[a-zA-Z]+$/)) {
      letterComponent += cellReference.charAt(index).toUpperCase();
    } else {
      break;
    }

    index++;
  }

  let col = 0;

  if (letterComponent.length === 1) {
    col = alphabet.findIndex(function (letter) {
      return letter === letterComponent;
    });
  } else {
    col =
      (alphabet.findIndex(function (letter) {
        return letter === letterComponent[0];
      }) +
        1) *
      26;
    col += alphabet.findIndex(function (letter) {
      return letter === letterComponent[1];
    });
  }

  var numberComponent = cellReference.substring(index);
  var row = parseInt(numberComponent) - 1;

  return [col, row];
}

function setCellValue(col, row, value, options) {
  if (!data[col][row]) {
    data[col][row] = {};
  }
  data[col][row].value = value;

  if (options) {
    data[col][row].options = options;
  }
}

function getCellValue(col, row) {
  if (!data[col][row]) {
    return "";
  }

  var cellValue = data[col][row].value.toString();

  if (cellValue.charAt(0) === "=") {
    cellValue = evaluateCell(cellValue.toString());
  }

  return cellValue;
}

function evaluateCell(cellValue) {
  if (cellValue.toString().charAt(0) === "=") {
    if (cellValue.indexOf("(") !== -1) {
      return runFunction(cellValue);
    } else {
      return calculateFormula(cellValue);
    }
  } else {
    return cellValue;
  }
}

function runFunction(func) {
  const functionName = func.substring(1, func.indexOf("("));

  if (functionName === "SUM") {
    const range = func.substring(func.indexOf("(") + 1, func.indexOf(")"));

    const cells = getCellsInRange(range);
    return cells
      .slice(1)
      .reduce(
        (total, next) => total + parseFloat(evaluateCell(next.value)),
        parseFloat(evaluateCell(cells[0].value))
      );
  } else if (functionName === "AVERAGE") {
    const range = func.substring(func.indexOf("(") + 1, func.indexOf(")"));

    const cells = getCellsInRange(range);
    return (
      cells
        .slice(1)
        .reduce(
          (total, next) => total + parseFloat(evaluateCell(next.value)),
          parseFloat(evaluateCell(cells[0].value))
        ) / cells.length
    );
  }
}

function getCellsInRange(range) {
  const [leftRef, rightRef] = range.split(":");
  const cells = [];

  let [startCol, startRow] = getCellCoordinates(leftRef);
  let [endCol, endRow] = getCellCoordinates(rightRef);

  for (
    let row = Math.min(startRow, endRow);
    row <= Math.max(startRow, endRow);
    row++
  ) {
    for (
      let col = Math.min(startCol, endCol);
      col <= Math.max(startCol, endCol);
      col++
    ) {
      cells.push(data[col][row]);
    }
  }

  return cells;
}

function calculateFormula(formula) {
  const formulas = {
    "+": function (left, right) {
      return parseInt(left) + parseInt(right);
    },
    "-": function (left, right) {
      return parseInt(left) - parseInt(right);
    },
    "*": function (left, right) {
      return parseInt(left) * parseInt(right);
    },
    "/": function (left, right) {
      return parseInt(left) / parseInt(right);
    },
    "%": function (left, right) {
      return parseInt(left) % parseInt(right);
    },
  };

  var result;

  var index = 1;
  var leftCellReference = "";
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

  var rightCellReference = "";
  while (index < formula.length) {
    if (formula.charAt(index).match(/^[0-9a-zA-Z]+$/)) {
      rightCellReference += formula.charAt(index).toUpperCase();
    } else {
      break;
    }

    index++;
  }

  if (operator in formulas) {
    var calculatedLeft = evaluateCell(cell(leftCellReference).value.toString());
    var calculatedRight = evaluateCell(
      cell(rightCellReference).value.toString()
    );

    result = formulas[operator](calculatedLeft, calculatedRight);
  }

  return result;
}

function columnLabel(count) {
  var firstLetter = "";
  var firstLetterIndex = Math.floor(count / 26);

  if (firstLetterIndex > 0) {
    firstLetter = alphabet[firstLetterIndex - 1];
  }

  var secondLetterIndex = count % alphabet.length;
  var secondLetter = alphabet[secondLetterIndex];

  return firstLetter + secondLetter;
}
