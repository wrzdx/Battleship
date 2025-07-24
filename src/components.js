export function createBoardSystem(board) {
  const boardSystem = document.createElement("div");
  boardSystem.className = "boardSystem";

  const boardContainer = document.createElement("div");
  boardContainer.className = "board";
  board.board.forEach((row) => {
    row.forEach((cell) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";
      if (cell.isHit) {
        cellDiv.classList.add("hit");
      }
      if (cell.ship) {
        cellDiv.classList.add("ship");
      }
      boardContainer.appendChild(cellDiv);
    });
  });

  const numbers = document.createElement("div");
  numbers.className = "numbers";

  for (let i = 1; i <= 10; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = i;
    numbers.append(cell);
  }

  const letters = document.createElement("div");
  letters.className = "letters";

  const startCode = 65;

  for (let i = 1; i <= 10; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = String.fromCharCode(startCode + i - 1);
    letters.append(cell);
  }

  const placeholderCell = document.createElement("div");
  placeholderCell.className = "cell placeholder";

  boardSystem.append(placeholderCell, numbers, letters, boardContainer);
  return boardSystem;
}

export function createShips(placedShips) {
  const container = document.createElement("div");
  container.className = "ships";

  const shipsToPlace = [4, 3, 2, 1];

  for (const ship of placedShips) {
    shipsToPlace[ship.length - 1]--;
  }
  shipsToPlace.reverse();

  for (let i = 0; i < 11; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    container.append(cell);
  }

  for (let i = 0; i < shipsToPlace.length; i++) {
    let cellCount = 1;
    const cell = document.createElement("div");
    cell.className = "cell";
    container.append(cell);
    
    for (let j = 0; j < shipsToPlace[i]; j++) {
      for (let k = 0; k < 4 - i; k++) {
        const cell = document.createElement("div");
        cell.className = "cell ship player";
        container.append(cell);
        cellCount++;
      }
      const cell = document.createElement("div");
      cell.className = "cell";
      container.append(cell);
      cellCount++;
    }

    for (
      let j = 0;
      j < 11 - cellCount + (i + 1 !== shipsToPlace.length ? 11 : 0);
      j++
    ) {
      const cell = document.createElement("div");
      cell.className = "cell";
      container.append(cell);
    }
  }

  return container;
}

export function createButton(text) {
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = text;
  return btn;
}
