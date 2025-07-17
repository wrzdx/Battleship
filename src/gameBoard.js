export default class GameBoard {
  constructor(size = 8) {
    this.size = size;
    this.board = [];
    this.init()
  }

  init() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null)
    );
  }
}
