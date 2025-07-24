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
        const boardSystem = createBoardSystem(this.player.board);
        const ships = createShips(this.player.board.ships);
        const btns = document.createElement("div");
        btns.className = "btns";
        const rotateBtn = createButton("Rotate");
        const randomBtn = createButton("Random");
        const playBtn = createButton("Play");
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