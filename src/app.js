import "./styles.css"

import { createBoardSystem, createButton, createShips } from "./components";
import Player from "./factories/player"

export default class App {
    constructor() {
        this.player = null;
        this.computer = null;
    }

    renderPlaceShipDiv() {
        const container = document.createElement("div");
        container.className = "placeShip"
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
        }
        const randomBtn = createButton("Random");
        const playBtn = createButton("Play");
        document.body.addEventListener("mouseup", (e) => {
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
            }
        });
        btns.append(rotateBtn, randomBtn, playBtn);
        container.append(title, boardSystem, ships, btns);
        document.body.innerHtml = "";
        document.body.append(container);
    }

    init() {
        this.player = new Player('Player', false);
        this.computer = new Player('Computer', true);
    }

    start() {
        this.init();
        this.renderPlaceShipDiv();
    }
}