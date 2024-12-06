const X_IMG = "../src/assets/x.svg";
const O_IMG = "../src/assets/o.svg";
const cellElements = document.querySelectorAll("[data-cell]");
let playerMark = "X";
let cpuMark = "O";
let circleTurn = false;
let scoreX = 0;
let scoreO = 0;

/*--CELLS CHANGE---*/
cellElements.forEach((cell) => {
  cell.addEventListener("click", handleClick, { once: true });
});

/*--TURNS--*/
function handleClick(e) {
  const cell = e.target;
  const currentMark = circleTurn ? cpuMark : playerMark;
  placeMark(cell, currentMark);
  if (checkWin(currentMark)) {
    endGame(false);
    updateScore(currentMark);
  } else if (isDraw()) {
    endGame(true);
  } else {
    // Swap turns
    swapTurns();
    if (circleTurn) {
      setTimeout(cpuPlay, 500);
    }
  }
}

/*--CELL IMGS MARK--*/
function placeMark(cell, mark) {
  const img = document.createElement("img");
  img.src = mark === "X" ? X_IMG : O_IMG;
  img.alt = mark;
  img.classList.add("mark-img");
  cell.appendChild(img);
  console.log(`Se colocó una ${mark} en la celda`);
}

/*--TURN INDICATOR--*/
function swapTurns() {
  const imgSwap = document.getElementById("turnImg");
  circleTurn = !circleTurn;
  if (circleTurn) {
    imgSwap.src = O_IMG;
  } else {
    imgSwap.src = X_IMG;
  }
  imgSwap.classList.add("referencia-img");
}

/*----CELLS FOR THE WIN----*/
function checkWin(currentMark) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winningCombinations.some((combination) =>
    combination.every(
      (index) => cellElements[index].querySelector("img")?.alt === currentMark
    )
  );
}
/*--CPU's MOVES IN RANDOM CELLS--*/
function cpuPlay() {
  const availableCells = [...cellElements].filter(
    (cell) => !cell.querySelector("img")
  );
  if (availableCells.length === 0) return;

  const randomCell =
    availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, cpuMark);

  if (checkWin(cpuMark)) {
    endGame(false);
    updateScore(cpuMark);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}
/*--DRAW--*/
function isDraw() {
  return [...cellElements].every((cell) => cell.querySelector("img"));
}

/*--END GAME--*/
function endGame(draw) {
  if (draw) {
    Swal.fire({
      title: "It's a draw!",
      icon: "warning",
      customClass: {
        popup: "alert-popup",
        confirmButton: "btn-popup",
      },
    });
  } else {
    Swal.fire({
      title: `${circleTurn ? "CPU" : "Jugador"} gana!`,
      icon: "success",
      customClass: {
        popup: "alert-popup",
        confirmButton: "btn-popup",
      },
    });
  }
  resetGame();
}

/*--SCORE--*/
function updateScore(currentMark) {
  if (currentMark === "X") {
    scoreX++;
    document.getElementById("score-x").textContent = scoreX;
  } else {
    scoreO++;
    document.getElementById("score-o").textContent = scoreO;
  }
}

const resetButton = document.getElementById("resetBtn");

resetButton.addEventListener("click", resetGame);

function resetGame() {
  cellElements.forEach((cell) => {
    cell.innerHTML = "";
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  circleTurn = playerMark === "O";
  scoreO.innerHTML = "";
  scoreX.innerHTML = "";
}
document.getElementById("resetBtn");
