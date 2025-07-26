export function createBoardSystem(board, isComputer = false) {
  const boardSystem = document.createElement("div");
  boardSystem.className = "boardSystem";

  const boardContainer = document.createElement("div");
  boardContainer.className = `board ${isComputer ? "computer" : "player"}`;
  board.board.forEach((row, x) => {
    row.forEach((cell, y) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";
      cellDiv.dataset.x = x;
      cellDiv.dataset.y = y;
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

export function createShips(placedShips, isRotated = false) {
  document.addEventListener("dragstart", (e) => e.preventDefault());
  const container = document.createElement("div");
  container.className = "ships";
  if (isRotated) {
    container.classList.add("rotated");
  }
  let isDragging = false;

  const shipsToPlace = [4, 3, 2, 1];

  for (const ship of placedShips) {
    shipsToPlace[ship.length - 1]--;
  }
  shipsToPlace.reverse();

  const size = isRotated ? 9 : 11;

  for (let i = 0; i < size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    container.append(cell);
  }

  for (let i = 0; i < shipsToPlace.length; i++) {
    if (!shipsToPlace[i]) continue;

    let cellCount = 1;
    const cell = document.createElement("div");
    cell.className = "cell";
    container.append(cell);

    for (let j = 0; j < shipsToPlace[i]; j++) {
      for (let k = 0; k < 4 - i; k++) {
        const cell = document.createElement("div");
        cell.className = "cell ship player";
        cell.addEventListener("mousedown", (e) => {
          if (isDragging) return;

          isDragging = true;

          const wholeShipCells = [];
          let isPossible = false;
          let prevCell = cell.previousElementSibling;
          while (prevCell && prevCell.classList.contains("ship")) {
            wholeShipCells.unshift(prevCell);
            prevCell = prevCell.previousElementSibling;
          }
          wholeShipCells.push(cell);
          let nextCell = cell.nextElementSibling;
          while (nextCell && nextCell.classList.contains("ship")) {
            wholeShipCells.push(nextCell);
            nextCell = nextCell.nextElementSibling;
          }

          const shadowCells = [];

          wholeShipCells.forEach((c) => {
            const shadowCell = document.createElement("div");
            shadowCell.className = "cell ship player shadow";
            shadowCell.style.width = `${c.offsetWidth}px`;
            shadowCell.style.height = `${c.offsetHeight}px`;
            shadowCell.style.left = `${c.offsetLeft}px`;
            shadowCell.style.top = `${c.offsetTop}px`;
            
            shadowCells.push(shadowCell);
            document.body.append(shadowCell);
          });

          const highlightShipSurroundings = () => {
            const boardDiv = document.querySelector(".board");
            const cols = 10;
            const rows = 10;
            const highlightIfNotShip = (surCell) => {
              if (!surCell || surCell.classList.contains("ship")) return;
              surCell.classList.add("surrounding");
            }
            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                const boardCell = boardDiv.children[i * cols + j];
                if (boardCell && boardCell.classList.contains("ship")) {
                  if (i - 1 >= 0 && j - 1 >= 0) {
                    highlightIfNotShip(boardDiv.children[(i - 1) * cols + j - 1]);
                  }
                  if (i - 1 >= 0) {
                    highlightIfNotShip(boardDiv.children[(i - 1) * cols + j]);
                  }
                  if (i - 1 >= 0 && j + 1 < cols) {
                    highlightIfNotShip(boardDiv.children[(i - 1) * cols + j + 1]);
                  }
                  if (j - 1 >= 0) {
                    highlightIfNotShip(boardDiv.children[i * cols + j - 1]);
                  }
                  if (j + 1 < cols) {
                    highlightIfNotShip(boardDiv.children[i * cols + j + 1]);
                  }
                  if (i + 1 < rows && j - 1 >= 0) {
                    highlightIfNotShip(boardDiv.children[(i + 1) * cols + j - 1]);
                  }
                  if (i + 1 < rows) {
                    highlightIfNotShip(boardDiv.children[(i + 1) * cols + j]);
                  }
                  if (i + 1 < rows && j + 1 < cols) {
                    highlightIfNotShip(boardDiv.children[(i + 1) * cols + j + 1]);
                  }
                }
              }
            }
          }

          highlightShipSurroundings();

          const onMouseMove = (e) => {
            isPossible = true;
            document.querySelectorAll(".cell.hovered").forEach((c) => {
              c.classList.remove("hovered");
            });
            shadowCells.forEach((shadowCell, index) => {
              const newX =
                e.pageX - shadowCell.offsetWidth/2 - 
                !isRotated * (((shadowCells.length - 1) * shadowCell.offsetWidth) / 2 -
                index * shadowCell.offsetWidth);
              shadowCell.style.left = `${newX}px`;
              const newY = e.pageY - shadowCell.offsetHeight / 2 -
                isRotated * (((shadowCells.length - 1) * shadowCell.offsetHeight) / 2 -
                index * shadowCell.offsetHeight);
              shadowCell.style.top = `${newY}px`;
              const hovered = document.elementFromPoint(
                parseFloat(newX + shadowCell.offsetWidth / 2),
                parseFloat(newY + shadowCell.offsetHeight / 2)
              );
              if (
                hovered &&
                hovered.classList.contains("cell") &&
                hovered.parentElement.classList.contains("board")
              ) {
                hovered.classList.add("hovered");
              }
            });
          };

          document.body.addEventListener("mousemove", onMouseMove);

          const onMouseUp = (e) => {
            shadowCells.forEach((shadowCell) => {
              shadowCell.remove();
            });
            document.body.removeEventListener("mousemove", onMouseMove);
            document.body.removeEventListener("mouseup", onMouseUp);
            isDragging = false;
            document.querySelectorAll(".board .cell.surrounding").forEach((c) => {
              c.classList.remove("surrounding");
            });
          };
          document.body.addEventListener("mouseup", onMouseUp);
        });
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
      j < size - cellCount + (i + 1 !== shipsToPlace.length ? size : 0);
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
