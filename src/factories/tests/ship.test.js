import Ship from "../ship";

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test("should initialize with correct length and zero hit parts", () => {
    expect(ship.length).toBe(3);
    expect(ship.hitParts.length).toBe(0);
    expect(ship.isSunk()).toBe(false);
  });

  describe("Ship hit() method", () => {
    test("should register the hit and return true", () => {
      expect(ship.hit(0, 0)).toBe(true);
      expect(ship.hitParts).toEqual([[0, 0]]);
    });

    test("should not register duplicate hit and return false", () => {
      expect(ship.hit(0, 0)).toBe(true);
      expect(ship.hit(0, 0)).toBe(false);
      expect(ship.hitParts).toEqual([[0, 0]]);
    });

    test("should register all hits up to ship length", () => {
      ship.hit(0, 0);
      ship.hit(0, 1);
      ship.hit(1, 1);

      expect(ship.hitParts).toEqual([
        [0, 0],
        [0, 1],
        [1, 1],
      ]);
    });

    test("should not register new hits and return false", () => {
      ship.hit(0, 0);
      ship.hit(0, 1);
      ship.hit(1, 1);

      expect(ship.hit(1, 2)).toBe(false);
      expect(ship.hitParts).not.toContainEqual([1, 2]);
      expect(ship.hitParts).toHaveLength(3);
    });
  });

  test("isSunk() should return true when hit parts reach length of ship", () => {
    ship.hit(0, 0);
    ship.hit(0, 1);
    ship.hit(0, 2);

    expect(ship.isSunk()).toBe(true);
  });
});
