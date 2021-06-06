import constants from "./constants";

function hasWon(numbersGrid) {
  for (let i = 0; i < numbersGrid.length; i++) {
    for (let j = 0; j < numbersGrid[i].length - 1; j++) {
      if (
        numbersGrid[i][j + 1] !== 0 &&
        numbersGrid[i][j + 1] - numbersGrid[i][j] !== 1
      ) {
        return false;
      }
    }
  }
  return true;
}

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function findIndexes(numbersGrid, value) {
  for (let i = 0; i < numbersGrid.length; i++) {
    for (let j = 0; j < numbersGrid[i].length; j++) {
      if (numbersGrid[i][j] === value) {
        return [i, j];
      }
    }
  }
  return [null, null];
}

function findEmptyNeighbour(numbersGrid, row, col) {
  const [emptyRow, emptyCol] = findIndexes(numbersGrid, constants.EMPTY_VALUE);

  const rowsDiff = Math.abs(row - emptyRow);
  const colsDiff = Math.abs(col - emptyCol);

  if (
    (rowsDiff === 0 && colsDiff === 1) ||
    (rowsDiff === 1 && colsDiff === 0)
  ) {
    let direction;
    if (rowsDiff === 0) {
      if (col > emptyCol) {
        direction = constants.DIRECTIONS.LEFT;
      } else {
        direction = constants.DIRECTIONS.RIGHT;
      }
    } else {
      if (row > emptyRow) {
        direction = constants.DIRECTIONS.TOP;
      } else {
        direction = constants.DIRECTIONS.BOTTOM;
      }
    }
    return [emptyRow, emptyCol, direction];
  }

  return [null, null, null];
}

function generateNumbersGrid() {
  // Generate array with values from 1 to 15
  const numbers = Array.from({ length: constants.BOARD_SIZE }, (v, k) => k);
  // Shuffle array
  numbers.sort(function () {
    return 0.5 - Math.random();
  });
  return sliceIntoChunks(numbers, Math.sqrt(constants.BOARD_SIZE));
}

export default {
  hasWon,
  sliceIntoChunks,
  findIndexes,
  findEmptyNeighbour,
  generateNumbersGrid,
};
