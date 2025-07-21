import Ship from "./ship";

export default class GameBoard {
  constructor(size = 8) {
    this.size = size;
    this.board = [];
    this.init();
  }

  init() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null)
    );
  }

  placeShip(positions) {
    const possibleToPlace = positions.every(
      (pos) =>
        pos[0] >= 0 &&
        pos[0] < this.board.length &&
        pos[1] >= 0 &&
        pos[1] < this.board[0].length &&
        !this.board[pos[0]][pos[1]]
    );
    if (possibleToPlace) {
      const ship = new Ship(positions.length);
      positions.forEach((pos) => {
        this.board[pos[0]][pos[1]] = ship;
      });
    }

    return possibleToPlace;
  }
}
