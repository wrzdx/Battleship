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
        expect(cell.ship).toBeNull();
        expect(cell.isHit).toBe(false);
      })
    });
  });


  describe("placeShip()", () => {
    test("should place ship in correct place on board and return true", () => {
      const positions = [[0, 0], [0, 1]];

      const result = gameBoard.placeShip(positions);

      expect(result).toBe(true);
      expect(gameBoard.board[0][0].ship).not.toBeNull();
      expect(gameBoard.board[0][1].ship).not.toBeNull();
    })

    test("shouldn't place ship in out of range place on board and return false", () => {
      const positions = [[0, 0], [0, 8]];

      const result = gameBoard.placeShip(positions);

      expect(result).toBe(false);
      expect(gameBoard.board[0][0].ship).toBeNull();
      expect(gameBoard.board[0][8]).toBe(undefined);
    })

    test("shouldn place two ship if the distance between them no less than 1", () => {
      const shipOne = [[0, 0], [0, 1]];
      const shipTwo = [[2, 0], [2, 1]];
      gameBoard.placeShip(shipOne);
      expect(gameBoard.placeShip(shipTwo)).toBe(true);
    }) 

    test("shouldn't place ships if the distance between them less than 1", () => {
      const shipOne = [[0, 0], [0, 1]];
      const shipTwo = [[1, 0], [1, 1]];
      const shipThree = [[0, 2], [0, 3]];
      gameBoard.placeShip(shipOne);
      expect(gameBoard.placeShip(shipTwo)).toBe(false);
      expect(gameBoard.placeShip(shipThree)).toBe(false);
    }) 
  })

  describe("receiveAttack()", () => {
    beforeEach(() => {
      const positions = [[0, 0], [0, 1]];
      gameBoard.placeShip(positions);
    })
    test("should hit ship on board and return true", () => {
      const result = gameBoard.receiveAttack([0, 0]);
      expect(result).toBe(true);
      expect(gameBoard.board[0][0].ship.hitParts).toContainEqual([0, 0])
    })

    test("should hit nothing on board and return false", () => {
      const result = gameBoard.receiveAttack([0, 2]);
      expect(result).toBe(false);
    })

    test("should return false if hit the same place twice", () => {
      gameBoard.receiveAttack([0, 0]);
      const result = gameBoard.receiveAttack([0, 0]);
      expect(result).toBe(false);
    })

    test("should write off all surrounding cells if ship is sunk", () => {
      gameBoard.receiveAttack([0, 0]);
      gameBoard.receiveAttack([0, 1]);
      expect(gameBoard.board[0][0].isHit).toBe(true);
      expect(gameBoard.board[0][1].isHit).toBe(true);
      expect(gameBoard.board[0][2].isHit).toBe(true);
      expect(gameBoard.board[1][2].isHit).toBe(true);
      expect(gameBoard.board[1][1].isHit).toBe(true);
      expect(gameBoard.board[1][0].isHit).toBe(true);
    })
  })

  test("areAllShipsSunk()", () => {
    const shipOne = [[0, 0], [0, 1]];
    const shipTwo = [[2, 0], [2, 1]];
    gameBoard.placeShip(shipOne);
    gameBoard.placeShip(shipTwo);
    expect(gameBoard.areAllShipsSunk()).toBe(false);
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([0, 1]);
    expect(gameBoard.areAllShipsSunk()).toBe(false);
    gameBoard.receiveAttack([2, 0]);
    gameBoard.receiveAttack([2, 1]);
    expect(gameBoard.areAllShipsSunk()).toBe(true);
  })
});
