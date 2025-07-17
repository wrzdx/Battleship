import Ship from "./ship";

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test("should initialize with correct length and zero hits", () => {
    expect(ship.length).toBe(3);
    expect(ship.hitCount).toBe(0);
    expect(ship.isSunk()).toBe(false);
  });

  test("hit() should increase hitCount of ship but no more than his length", () => {
    ship.hit();
    expect(ship.hitCount).toBe(1);

    ship.hit();
    expect(ship.hitCount).toBe(2);

    ship.hit();
    expect(ship.hitCount).toBe(3);
    
    ship.hit();
    expect(ship.hitCount).toBe(3);
  });

  test("isSunk() should return true when hits reach length of ship", () => {
    ship.hit();
    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
  });
});
