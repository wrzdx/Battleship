import GameBoard from "./gameBoard"

export default class Player {
  constructor(nickname, isComputer) {
    this.board = new GameBoard();
    this.isComputer = isComputer;
    this.nickname = nickname; 
  }
}