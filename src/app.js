import "./styles.css";

import { createBoardSystem, createButton, createShips } from "./components";
import Player from "./factories/player";

export default class App {
  constructor() {
    this.player = null;
    this.computer = null;
  }

  renderPlaceShipDiv() {
    const container = document.createElement("div");
    container.className = "placeShip";
    const title = document.createElement("h1");
    title.textContent = "Battleship";
    let boardSystem = createBoardSystem(this.player.board);

    let rotation = false;
    let ships = createShips(this.player.board.ships, rotation);

    const btns = document.createElement("div");
    btns.className = "btns";
    const rotateBtn = createButton("Rotate");
    rotateBtn.onclick = (e) => {
      rotation = !rotation;
      const newShips = createShips(this.player.board.ships, rotation);
      ships.replaceWith(newShips);
      ships = newShips;
    };
    const randomBtn = createButton("Random");
    const playBtn = createButton("Play");
    playBtn.classList.add("disabled");
    randomBtn.onclick = (e) => {
      this.player.board.randomizeShips();
      const newBoardSystem = createBoardSystem(this.player.board);
      const newShips = createShips(this.player.board.ships, rotation);

      boardSystem.replaceWith(newBoardSystem);
      ships.replaceWith(newShips);

      boardSystem = newBoardSystem;
      ships = newShips;
      playBtn.classList.remove("disabled");
    };

    const onMouseUpClearCells = (e) => {
      const hovered = document.querySelectorAll(".cell.hovered");
      const shadowCells = document.querySelectorAll(".cell.ship.shadow");
      if (hovered.length !== shadowCells.length) {
        hovered.forEach((cell) => {
          cell.classList.remove("hovered");
        });
        return;
      }
      const positions = [];
      hovered.forEach((cell) => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        cell.classList.remove("hovered");

        positions.push([x, y]);
      });
      const result = this.player.board.placeShip(positions);
      if (result) {
        const newBoardSystem = createBoardSystem(this.player.board);
        const newShips = createShips(this.player.board.ships, rotation);

        boardSystem.replaceWith(newBoardSystem);
        ships.replaceWith(newShips);

        boardSystem = newBoardSystem;
        ships = newShips;
        if (this.player.board.areAllShipsPlaced()) {
          playBtn.classList.remove("disabled");
        }
      }
    };
    document.body.addEventListener("mouseup", onMouseUpClearCells);
    playBtn.onclick = (e) => {
      document.body.removeEventListener("mouseup", onMouseUpClearCells);
      this.renderGameBoard();
    };
    btns.append(rotateBtn, randomBtn, playBtn);
    container.append(title, boardSystem, ships, btns);
    document.body.innerHtml = "";
    document.body.append(container);
  }

  renderPlayAgain(isPlayerWin) {
    const blurContainer = document.createElement("div");
    blurContainer.className = "blurContainer";
    const playAgainDiv = document.createElement("div");
    playAgainDiv.className = "playAgain";
    const title = document.createElement("h1");
    title.textContent = isPlayerWin ? "You won!" : "Computer won!";
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "Play again";
    btn.onclick = (e) => {
      document.body.innerHTML = "";
      this.start();
    };
    playAgainDiv.append(title, btn);
    blurContainer.append(playAgainDiv);
    document.body.append(blurContainer);
  }

  renderGameBoard() {
    const container = document.createElement("div");
    container.className = "gameBoard";
    const title = document.createElement("h1");
    title.textContent = "Battleship";
    let playerBoardSystem = createBoardSystem(this.player.board);
    this.computer.board.randomizeShips();
    let computerBoardSystem = createBoardSystem(this.computer.board, true);
    let computerBoard = computerBoardSystem.querySelector(".board");
    let isPlayerTurn = true;
    let isHunting = false;
    let targetCell = [null, null];
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const attack = async (e) => {
      if (e.target.classList.contains("hit") || !isPlayerTurn) return;

      const x = +e.target.dataset.x;
      const y = +e.target.dataset.y;
      if (isNaN(x) || isNaN(y)) return;

      const result = this.computer.board.receiveAttack([x, y]);

      let newComputerBoardSystem = createBoardSystem(this.computer.board, true);
      computerBoardSystem.replaceWith(newComputerBoardSystem);
      computerBoardSystem = newComputerBoardSystem;
      computerBoardSystem.querySelector(".board").onclick = attack;

      if (this.computer.board.areAllShipsSunk()) {
        this.renderPlayAgain(true);
        return;
      }

      if (!result) {
        isPlayerTurn = false;
        const getIndex = () => {
          if (isHunting) {
            const possibleTargets = [
              [targetCell[0] - 1, targetCell[1]],
              [targetCell[0] + 1, targetCell[1]],
              [targetCell[0], targetCell[1] - 1],
              [targetCell[0], targetCell[1] + 1],
            ].filter((pos) => {
              return (
                pos[0] >= 0 &&
                pos[0] < this.player.board.size &&
                pos[1] >= 0 &&
                pos[1] < this.player.board.size &&
                !this.player.board.board[pos[0]][pos[1]].isHit
              );
            });

            if (possibleTargets.length > 0) {
              const randomIndex = Math.floor(Math.random() * possibleTargets.length);
              return possibleTargets[randomIndex];
            }
          }
          return [Math.floor(Math.random() * this.player.board.size), Math.floor(Math.random() * this.player.board.size)];
        }
        await sleep(500);

        while (true) {
          const [x1, y1] = getIndex();
          const cell = this.player.board.board[x1][y1];

          if (!cell.isHit) {
            const computerResult = this.player.board.receiveAttack([x1, y1]);

            let newPlayerBoardSystem = createBoardSystem(this.player.board);
            playerBoardSystem.replaceWith(newPlayerBoardSystem);
            playerBoardSystem = newPlayerBoardSystem;

            await sleep(500);

            if (this.player.board.areAllShipsSunk()) {
              this.renderPlayAgain(false);
              return;
            }

            if (!computerResult) {
              isPlayerTurn = true;
              break;
            } else {
              targetCell = [x1, y1];
              isHunting = true;
              const ship = this.player.board.board[x1][y1].ship;
              if (ship.isSunk()) {
                isHunting = false;
                targetCell = [null, null];
              }
            }
          }
        }
      }
    };

    computerBoard.onclick = attack;

    container.append(title, playerBoardSystem, computerBoardSystem);
    document.body.innerHTML = "";
    document.body.append(container);
  }

  init() {
    this.player = new Player("Player", false);
    this.computer = new Player("Computer", true);
  }

  start() {
    this.init();
    this.renderPlaceShipDiv();
  }
}
