import GameBoard from "./gameBoard";

describe("gameBoard", () => {
  let gameBoard;

  beforeEach(() => {
    gameBoard = new GameBoard(8);
  });

  test("should initialize with correct size and empty board", () => {
    expect(gameBoard.size).toBe(8);
    expect(gameBoard.board).toHaveLength(8); 

    gameBoard.board.forEach((row) => {
      expect(row).toHaveLength(8);
      row.forEach((cell) => {
        expect(cell).toBeNull()
      })

    });
  });
});
