import Ship from "./ship";

class Cell {
  constructor() {
    this.isHit = false;
    this.ship = null;
  }
}

export default class GameBoard {
  constructor(size = 8) {
    this.size = size;
    this.board = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(new Cell());
      }
      this.board.push(row);
    }
  }

  #getSurroundingPositionsOfShip(positions) {
    const surroundingPositions = [];
    positions.forEach((pos) => {
      const surrounding = [
        [pos[0] - 1, pos[1] - 1],
        [pos[0] - 1, pos[1]],
        [pos[0] - 1, pos[1] + 1],
        [pos[0], pos[1] - 1],
        [pos[0], pos[1] + 1],
        [pos[0] + 1, pos[1] - 1],
        [pos[0] + 1, pos[1]],
        [pos[0] + 1, pos[1] + 1],
      ];
      surrounding.forEach((pos) => {
        if (!surroundingPositions.includes(pos)) {
          surroundingPositions.push(pos);
        }
      });
    });

    return surroundingPositions;
  }

  placeShip(positions) {
    const surroundingPositions = this.#getSurroundingPositionsOfShip(positions);

    const possibleToPlace =
      positions.every(
        (pos) =>
          pos[0] >= 0 &&
          pos[0] < this.board.length &&
          pos[1] >= 0 &&
          pos[1] < this.board[0].length &&
          !this.board[pos[0]][pos[1]].isHit &&
          !this.board[pos[0]][pos[1]].ship
      ) &&
      surroundingPositions.every(
        (pos) =>
          !(
            pos[0] >= 0 &&
            pos[0] < this.board.length &&
            pos[1] >= 0 &&
            pos[1] < this.board[0].length
          ) || !this.board[pos[0]][pos[1]].ship
      );

    if (possibleToPlace) {
      const ship = new Ship(positions.length);
      positions.forEach((pos) => {
        this.board[pos[0]][pos[1]].ship = ship;
      });
    }

    return possibleToPlace;
  }

  receiveAttack(position) {
    const result = this.board[position[0]][position[1]].ship
      ? this.board[position[0]][position[1]].ship.hit(position[0], position[1])
      : false;
    this.board[position[0]][position[1]].isHit = true;

    if (this.board[position[0]][position[1]].ship?.isSunk()) {
      const surroundingPositions = this.#getSurroundingPositionsOfShip(
        this.board[position[0]][position[1]].ship.hitParts
      );
      surroundingPositions.forEach((pos) => {
        if (
          pos[0] >= 0 &&
          pos[0] < this.board.length &&
          pos[1] >= 0 &&
          pos[1] < this.board[0].length
        ) {
          this.board[pos[0]][pos[1]].isHit = true;
        }
      });
    }
    return result;
  }
}
