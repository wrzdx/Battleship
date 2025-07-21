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
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(new Cell())
    );
  }

  placeShip(positions) {
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

  receiveAttack(position) {}
}
