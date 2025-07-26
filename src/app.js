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
    }
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
    const attack = (e) => {
      if (e.target.classList.contains("hit") || !isPlayerTurn) return;
      const x = e.target.dataset.x;
      const y = e.target.dataset.y;
      const result = this.computer.board.receiveAttack([x, y]);
      const newComputerBoardSystem = createBoardSystem(this.computer.board, true);
      computerBoardSystem.replaceWith(newComputerBoardSystem);
      computerBoardSystem = newComputerBoardSystem;
      computerBoardSystem.querySelector(".board").onclick = attack;

      if (!result) {
        isPlayerTurn = false;
        while (true) {
          const x1 = Math.floor(Math.random() * this.player.board.size);
          const y1 = Math.floor(Math.random() * this.player.board.size);
          const cell = this.player.board.board[x1][y1];
          if (!cell?.isHit) {
            const computerResult = this.player.board.receiveAttack([x1, y1]);
            if (!computerResult) {
              break;      
            } else {
              if (this.player.board.areAllShipsSunk()) {
                alert("Computer won!");
                break;
              }
            }
          }
        }
        const newPlayerBoardSystem = createBoardSystem(this.player.board);
        playerBoardSystem.replaceWith(newPlayerBoardSystem);
        playerBoardSystem = newPlayerBoardSystem;
        isPlayerTurn = true;
      } else {
        if (this.computer.board.areAllShipsSunk()) {
          alert("Player won!");
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
