import "./style/index.scss";

import Board from "./Board";

const board = new Board();

const boardWrapper = document.querySelector("#board-wrapper");
boardWrapper.appendChild(board.rootElement);

const restartBtn = document.querySelector("#restart-btn");
const movesCount = document.querySelector(".moves-count");
const time = document.querySelector("#time");

restartBtn.addEventListener("click", board.restart.bind(board));

board.onMovesCountChange = () => {
  movesCount.innerHTML = board.movesCount;
};

board.onSecondsChange = () => {
  time.innerHTML = `${board.seconds}s`;
};
