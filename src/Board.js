import Hammer from "hammerjs";

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
    this._seconds = 0;
    this.timer = null;
    this._movesCount = 0;
    this.onMovesCountChange = null;
    this.onSecondsChange = null;

    this.renderBg();
    this.render();

    this.winScreen = document.createElement("div");
    this.winScreen.innerText = "You won";
    this.winScreen.classList.add("board__win");
    this.rootElement.appendChild(this.winScreen);

    // this.rootElement.addEventListener("click", this.handleClick.bind(this));
    const hammer = new Hammer(this.rootElement);
    hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
    hammer.on("tap", this.handleClick.bind(this));
    hammer.on("swipe", this.handleClick.bind(this));
  }

  get movesCount() {
    return this._movesCount;
  }

  set movesCount(value) {
    this._movesCount = value;
    if (
      this.onMovesCountChange &&
      this.onMovesCountChange instanceof Function
    ) {
      this.onMovesCountChange();
    }
  }

  get seconds() {
    return this._seconds;
  }
  set seconds(value) {
    this._seconds = value;
    if (this.onSecondsChange && this.onSecondsChange instanceof Function) {
      this.onSecondsChange();
    }
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
    this.movesCount = 0;
    this.stopTimer();
    this.seconds = 0;
  }

  stopTimer() {
    clearTimeout(this.timer);
  }

  startTimer() {
    const incrementSeconds = () => {
      this.seconds++;
      this.timer = setTimeout(incrementSeconds, 1000);
    };

    if (!this.timer) {
      this.timer = setTimeout(incrementSeconds, 1000);
    }
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

    this.startTimer();

    const [row, col] = utils.findIndexes(this.numbersGrid, number);

    const clickedCell = this.cells[row][col];

    const [emptyRow, emptyCol, direction] = utils.findEmptyNeighbour(
      this.numbersGrid,
      row,
      col
    );

    console.log(emptyRow, emptyCol, direction);

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
    this.movesCount++;
    if (utils.hasWon(this.numbersGrid)) {
      this.showWinScreen();
      this.stopTimer();
    }
  }
}
