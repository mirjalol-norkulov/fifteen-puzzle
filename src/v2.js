import "./style/index.scss";

import Board from "./Board";

const board = new Board();

const boardWrapper = document.querySelector("#board-wrapper");
boardWrapper.appendChild(board.rootElement);

const restartBtn = document.querySelector("#restart-btn");
restartBtn.addEventListener("click", board.restart.bind(board));
