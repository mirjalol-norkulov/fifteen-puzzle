import "@/style/index.scss";
import utils from "./utils";
import constants from "./constants";

let movesCount = 0;

function handleCellClick(event) {
  const cell = event.target.closest(".board__cell");
  if (!cell) {
    return;
  }
  const number = Number(cell.innerText);
  if (number === 0) {
    return;
  }

  const [row, col] = utils.findIndexes(numbersGrid, number);
  const clickedCell = cells[row][col];

  const [emptyRow, emptyCol, direction] = utils.findEmptyNeighbour(
    numbersGrid,
    row,
    col
  );

  console.log(emptyRow, emptyCol, direction);

  if (emptyRow === null || emptyCol === null || direction === null) {
    return;
  }

  const emptyCell = cells[emptyRow][emptyCol];

  let transform;
  switch (direction) {
    case constants.DIRECTIONS.TOP:
      transform = "translateY(calc(-100% - 10px))";
      break;
    case constants.DIRECTIONS.BOTTOM:
      transform = "translateY(calc(100% + 10px))";
      break;
    case constants.DIRECTIONS.LEFT:
      transform = "translateX(calc(-100% - 10px))";
      break;
    case constants.DIRECTIONS.RIGHT:
      transform = "translateX(calc(100% + 10px))";
      break;
  }

  if (clickedCell.style.transform) {
    clickedCell.style.transform = "";
  } else {
    clickedCell.style.transform = transform;
  }

  cells[emptyRow][emptyCol] = clickedCell;
  cells[row][col] = emptyCell;

  const temp = numbersGrid[row][col];
  numbersGrid[row][col] = numbersGrid[emptyRow][emptyCol];
  numbersGrid[emptyRow][emptyCol] = temp;

  clickedCell.addEventListener(
    "transitionend",
    () => {
      if (window.debounceTimer) {
        clearTimeout(window.debounceTimer);
      }
      window.debounceTimer = setTimeout(() => {
        if (utils.hasWon(numbersGrid)) {
          alert("You won!");
        }
        renderBoard();
        clickedCell.transitioning = false;
      }, 300);
    },
    { once: true }
  );
}

let numbersGrid = utils.generateNumbersGrid();

const board = document.querySelector("#board");
board.addEventListener("click", handleCellClick);

board.innerHTML = "";

let cells = Array(4);

function renderBoardBg() {
  const boardBg = document.createElement("div");
  boardBg.classList.add("board__bg");
  for (let i = 0; i < constants.BOARD_SIZE; i++) {
    const bgCell = document.createElement("div");
    bgCell.className = "board__cell board__cell--empty";
    boardBg.appendChild(bgCell);
  }
  board.prepend(boardBg);
}

function clearBoard() {
  for (let i = 0; i < cells.length; i++) {
    if (!Array.isArray(cells[i])) {
      return;
    }
    for (let j = 0; j < cells[i].length; j++) {
      cells[i][j].remove();
    }
  }
}

function renderBoard() {
  clearBoard();
  numbersGrid.forEach((numbers, i) => {
    cells[i] = Array(4);
    numbers.forEach((number, j) => {
      const cell = document.createElement("div");
      cell.classList.add("board__cell");
      if (number) {
        const cellText = document.createTextNode(String(number));
        cell.appendChild(cellText);
      } else {
        cell.classList.add("board__cell--empty");
      }
      cells[i][j] = cell;
      board.appendChild(cell);
    });
  });
}

renderBoardBg();
renderBoard();

const restartBtn = document.querySelector("#restart-btn");
restartBtn.addEventListener("click", () => {
  numbersGrid = utils.generateNumbersGrid();
  renderBoard();
});

if (module.hot) {
  module.hot.accept();
}
