const boardSize = 15;
const emptyValue = 0;
const blackValue = 1;
const whiteValue = 2;

const boardElement = document.getElementById("board");
const currentPlayerElement = document.getElementById("current-player");
const gameMessageElement = document.getElementById("game-message");
const restartButton = document.getElementById("restart-button");

let boardState = [];
let currentPlayer = blackValue;
let isGameOver = false;

// 初始化整个游戏状态与界面
function initializeGame() {
  boardState = Array.from({ length: boardSize }, () => Array(boardSize).fill(emptyValue));
  currentPlayer = blackValue;
  isGameOver = false;
  currentPlayerElement.textContent = getPlayerLabel(currentPlayer);
  gameMessageElement.textContent = "请黑子先行。";
  renderBoard();
}

// 根据当前状态重新绘制棋盘
function renderBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const cellElement = document.createElement("button");
      cellElement.type = "button";
      cellElement.className = "cell";
      cellElement.dataset.row = String(row);
      cellElement.dataset.col = String(col);
      cellElement.setAttribute("aria-label", `第 ${row + 1} 行，第 ${col + 1} 列`);

      const cellValue = boardState[row][col];
      if (cellValue !== emptyValue) {
        const pieceElement = document.createElement("span");
        pieceElement.className = `piece ${cellValue === blackValue ? "black" : "white"}`;
        cellElement.appendChild(pieceElement);
      }

      cellElement.addEventListener("click", handleCellClick);
      boardElement.appendChild(cellElement);
    }
  }
}

// 处理玩家点击棋盘的落子动作
function handleCellClick(event) {
  if (isGameOver) {
    return;
  }

  const row = Number(event.currentTarget.dataset.row);
  const col = Number(event.currentTarget.dataset.col);

  if (boardState[row][col] !== emptyValue) {
    gameMessageElement.textContent = "此处已有棋子，请另择一处落子。";
    return;
  }

  boardState[row][col] = currentPlayer;
  renderBoard();

  if (checkWin(row, col, currentPlayer)) {
    isGameOver = true;
    currentPlayerElement.textContent = getPlayerLabel(currentPlayer);
    gameMessageElement.textContent = `${getPlayerLabel(currentPlayer)}获胜！`;
    return;
  }

  currentPlayer = currentPlayer === blackValue ? whiteValue : blackValue;
  currentPlayerElement.textContent = getPlayerLabel(currentPlayer);
  gameMessageElement.textContent = `请${getPlayerLabel(currentPlayer)}落子。`;
}

// 返回当前棋手对应的中文名称
function getPlayerLabel(playerValue) {
  return playerValue === blackValue ? "黑子" : "白子";
}

// 从落子点向四个方向检查是否已经形成五连
function checkWin(row, col, playerValue) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  return directions.some(([rowStep, colStep]) => {
    const count =
      countContinuousPieces(row, col, rowStep, colStep, playerValue) +
      countContinuousPieces(row, col, -rowStep, -colStep, playerValue) -
      1;

    return count >= 5;
  });
}

// 沿某一方向统计连续相同棋子的数量
function countContinuousPieces(startRow, startCol, rowStep, colStep, playerValue) {
  let count = 0;
  let row = startRow;
  let col = startCol;

  while (
    row >= 0 &&
    row < boardSize &&
    col >= 0 &&
    col < boardSize &&
    boardState[row][col] === playerValue
  ) {
    count += 1;
    row += rowStep;
    col += colStep;
  }

  return count;
}

restartButton.addEventListener("click", initializeGame);

initializeGame();
