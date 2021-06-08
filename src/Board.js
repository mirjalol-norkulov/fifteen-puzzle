import utils from "./utils";
import constants from "./constants";
import Cell from "./Cell";

export default class Board {
  constructor(size = 16) {
    this.size = size;
    this.numbersGrid = utils.generateNumbersGrid();

    this.rootElement = document.createElement("div");
    this.rootElement.classList.add("board");
    this.cells = Array(Math.sqrt(this.size));

    this.renderBg();
    this.render();

    this.winScreen = document.createElement("div");
    this.winScreen.innerText = "You won";
    this.winScreen.classList.add("board__win");
    this.rootElement.appendChild(this.winScreen);

    this.rootElement.addEventListener("click", this.handleClick.bind(this));
  }

  renderBg() {
    const boardBg = document.createElement("div");
    boardBg.classList.add("board__bg");
    for (let i = 0; i < constants.BOARD_SIZE; i++) {
      const bgCell = new Cell(true);
      boardBg.appendChild(bgCell.rootElement);
    }
    this.rootElement.prepend(boardBg);
  }

  render() {
    this.clear();
    this.numbersGrid.forEach((numbers, i) => {
      this.cells[i] = Array(4);
      numbers.forEach((number, j) => {
        const text = number === 0 ? "" : String(number);
        const cell = new Cell(number === 0, text, [i, j]);
        this.cells[i][j] = cell;
        this.rootElement.appendChild(cell.rootElement);
      });
    });
  }

  clear() {
    for (let i = 0; i < this.cells.length; i++) {
      if (!Array.isArray(this.cells[i])) {
        return;
      }
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].rootElement.remove();
      }
    }
  }

  restart() {
    this.numbersGrid = utils.generateNumbersGrid();
    this.hideWinScreen();
    this.clear();
    this.render();
  }

  showWinScreen() {
    this.winScreen.classList.add("board__win--active");
  }
  hideWinScreen() {
    this.winScreen.classList.remove("board__win--active");
  }

  handleClick(event) {
    const cellElement = event.target.closest(".board__cell");
    if (!cellElement) {
      return;
    }

    const number = Number(cellElement.innerText);
    if (number === 0) {
      return;
    }

    const [row, col] = utils.findIndexes(this.numbersGrid, number);
    const clickedCell = this.cells[row][col];

    const [emptyRow, emptyCol, direction] = utils.findEmptyNeighbour(
      this.numbersGrid,
      row,
      col
    );

    if (emptyRow === null || emptyCol === null || !direction) {
      return;
    }

    let temp = this.numbersGrid[row][col];
    this.numbersGrid[row][col] = this.numbersGrid[emptyRow][emptyCol];
    this.numbersGrid[emptyRow][emptyCol] = temp;

    temp = this.cells[row][col];
    this.cells[row][col] = this.cells[emptyRow][emptyCol];
    this.cells[emptyRow][emptyCol] = temp;

    clickedCell.move(direction, [emptyRow, emptyCol]);

    if (utils.hasWon(this.numbersGrid)) {
      this.showWinScreen();
    }
  }
}
