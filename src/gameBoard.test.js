import GameBoard from "./gameBoard";
import Ship from "./ship";

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


  describe("placeShip()", () => {
    test("should place ship in correct place on board and return true", () => {
      const positions = [[0, 0], [0, 1]];

      const result = gameBoard.placeShip(positions);

      expect(result).toBe(true);
      expect(gameBoard.board[0][0]).not.toBeNull();
      expect(gameBoard.board[0][1]).not.toBeNull();
    })

    test("shouldn't place ship in given place on board and return false", () => {
      const positions = [[0, 0], [0, 8]];

      const result = gameBoard.placeShip(positions);

      expect(result).toBe(false);
      expect(gameBoard.board[0][0]).toBeNull();
      expect(gameBoard.board[0][8]).toBe(undefined);
    })
  })
});
