import GameBoard from "../gameBoard";
import Player from "../player";

describe("Player", () => {
  test("init real player with correct data", () => {
    const player = new Player("player", false);
    expect(player.nickname).toBe("player");
    expect(player.isComputer).toBe(false);
    expect(player.board).toBeInstanceOf(GameBoard);
  })
})