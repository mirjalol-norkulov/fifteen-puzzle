import { DIRECTIONS, GRID_GAP } from "./constants";

export default class Cell {
  constructor(isEmpty = false, text = "", initialPosition) {
    this.rootElement = document.createElement("div");
    this.rootElement.classList.add("board__cell");
    if (isEmpty) {
      this.rootElement.classList.add("board__cell--empty");
    }
    this.text = text;
    this.isEmpty = isEmpty;
    this.textNode = document.createTextNode(text);
    this.rootElement.appendChild(this.textNode);
    this.transform = [0, 0];
    this.initialPosition = initialPosition;
  }

  move(direction, targetPosition) {
    this.rootElement.style.transform = this.getTransform(
      direction,
      targetPosition
    );
  }

  getTransform(direction, targetPosition) {
    const [currentX, currentY] = this.transform;
    let x, y;

    switch (direction) {
      case DIRECTIONS.TOP:
        x = currentX;
        y = currentY - 100;
        break;
      case DIRECTIONS.RIGHT:
        x = currentX + 100;
        y = currentY;
        break;
      case DIRECTIONS.BOTTOM:
        x = currentX;
        y = currentY + 100;
        break;
      case DIRECTIONS.LEFT:
        x = currentX - 100;
        y = currentY;
        break;
    }
    this.transform = [x, y];

    const [positionY, positionX] = this.initialPosition;
    const [targetY, targetX] = targetPosition;
    const xGap = Math.abs(targetX - positionX) * GRID_GAP;
    const yGap = Math.abs(targetY - positionY) * GRID_GAP;
    const signX = targetX > positionX ? "+" : "-";
    const signY = targetY > positionY ? "+" : "-";

    const transformX = `calc(${x}% ${signX} ${xGap}px)`;
    const transformY = `calc(${y}% ${signY} ${yGap}px)`;

    return `translate(${transformX}, ${transformY})`;
  }
}
