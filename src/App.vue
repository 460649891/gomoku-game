<script setup>
import { computed, ref } from 'vue'

const BOARD_SIZE = 15
const EMPTY = 0
const BLACK = 1
const WHITE = 2

// 初始化 15x15 棋盘，0 表示空位，1 表示黑子，2 表示白子。
const createEmptyBoard = () =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY))

const boardState = ref(createEmptyBoard())
const currentPlayer = ref(BLACK)
const isGameOver = ref(false)
const winner = ref(EMPTY)
const gameMessage = ref('请黑子先行。')
const lastMove = ref(null)
const moveCount = ref(0)

const currentPlayerLabel = computed(() => getPlayerLabel(currentPlayer.value))
const winnerLabel = computed(() =>
  winner.value === EMPTY ? '未分胜负' : `${getPlayerLabel(winner.value)}获胜`
)
const alertType = computed(() => (winner.value !== EMPTY ? 'success' : 'info'))
const gameStatusLabel = computed(() =>
  winner.value !== EMPTY ? '对局已结束' : '对局进行中'
)

const flatBoard = computed(() =>
  boardState.value.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value,
      isLastMove:
        lastMove.value?.row === rowIndex && lastMove.value?.col === colIndex
    }))
  )
)

function getPlayerLabel(playerValue) {
  return playerValue === BLACK ? '黑子' : '白子'
}

function getCellAriaLabel(row, col, value) {
  const pieceLabel = value === EMPTY ? '空位' : `${getPlayerLabel(value)}已落子`
  return `第 ${row + 1} 行，第 ${col + 1} 列，${pieceLabel}`
}

// 处理玩家点击棋盘后的落子流程：校验空位、写入棋子、判断胜负，并切换下一手。
function handleMove(row, col) {
  if (isGameOver.value) {
    return
  }

  if (boardState.value[row][col] !== EMPTY) {
    gameMessage.value = '此处已有棋子，请另择一处落子。'
    return
  }

  boardState.value[row][col] = currentPlayer.value
  lastMove.value = { row, col }
  moveCount.value += 1

  if (checkWin(row, col, currentPlayer.value)) {
    winner.value = currentPlayer.value
    isGameOver.value = true
    gameMessage.value = `${getPlayerLabel(currentPlayer.value)}已成五连，胜局已定。`
    return
  }

  currentPlayer.value = currentPlayer.value === BLACK ? WHITE : BLACK
  gameMessage.value = `请${getPlayerLabel(currentPlayer.value)}落子。`
}

// 从当前落子点向横、竖、主对角、副对角四个方向检查是否形成五连。
function checkWin(row, col, playerValue) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ]

  return directions.some(([rowStep, colStep]) => {
    const count =
      countContinuousPieces(row, col, rowStep, colStep, playerValue) +
      countContinuousPieces(row, col, -rowStep, -colStep, playerValue) -
      1

    return count >= 5
  })
}

// 沿单一方向累计连续同色棋子数量，用于合并正反两个方向的统计结果。
function countContinuousPieces(startRow, startCol, rowStep, colStep, playerValue) {
  let count = 0
  let row = startRow
  let col = startCol

  while (
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE &&
    boardState.value[row][col] === playerValue
  ) {
    count += 1
    row += rowStep
    col += colStep
  }

  return count
}

// 重新开始时，完整重置棋盘、行棋方、提示文案与最近一步记录。
function resetGame() {
  boardState.value = createEmptyBoard()
  currentPlayer.value = BLACK
  isGameOver.value = false
  winner.value = EMPTY
  gameMessage.value = '请黑子先行。'
  lastMove.value = null
  moveCount.value = 0
}
</script>

<template>
  <div class="page-shell">
    <el-card class="game-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div>
            <h1 class="game-title">五子棋</h1>
            <p class="game-subtitle">Vue 3 + Element Plus 重构版，界面更整洁，交互更清晰。</p>
          </div>
          <el-button type="primary" size="large" round @click="resetGame">
            重新开始
          </el-button>
        </div>
      </template>

      <div class="status-grid">
        <el-card class="status-panel" shadow="never">
          <span class="status-label">当前执子</span>
          <div class="status-value with-piece">
            <span
              class="piece-dot"
              :class="currentPlayer === BLACK ? 'black' : 'white'"
            ></span>
            <span>{{ currentPlayerLabel }}</span>
          </div>
        </el-card>

        <el-card class="status-panel" shadow="never">
          <span class="status-label">对局状态</span>
          <div class="status-value">{{ gameStatusLabel }}</div>
          <div class="status-subtext">{{ winnerLabel }}</div>
        </el-card>

        <el-card class="status-panel" shadow="never">
          <span class="status-label">落子总数</span>
          <div class="status-value">{{ moveCount }}</div>
          <div class="status-subtext">棋盘大小 {{ BOARD_SIZE }} × {{ BOARD_SIZE }}</div>
        </el-card>
      </div>

      <el-alert
        class="status-alert"
        :title="gameMessage"
        :type="alertType"
        :closable="false"
        show-icon
      />

      <section class="board-section">
        <div class="board" role="grid" aria-label="五子棋棋盘">
          <button
            v-for="cell in flatBoard"
            :key="`${cell.row}-${cell.col}`"
            class="cell"
            :class="{
              occupied: cell.value !== EMPTY,
              'game-over': isGameOver,
              'last-move': cell.isLastMove
            }"
            type="button"
            :aria-label="getCellAriaLabel(cell.row, cell.col, cell.value)"
            :disabled="isGameOver || cell.value !== EMPTY"
            @click="handleMove(cell.row, cell.col)"
          >
            <span
              v-if="cell.value !== EMPTY"
              class="piece"
              :class="cell.value === BLACK ? 'black' : 'white'"
            ></span>
          </button>
        </div>
      </section>

      <p class="board-tip">支持横向、纵向与双斜线五连判胜。</p>
    </el-card>
  </div>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-card {
  width: min(100%, 1080px);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.game-title {
  margin: 0;
  font-size: clamp(30px, 4vw, 38px);
  line-height: 1.1;
  color: #111827;
}

.game-subtitle {
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 15px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.status-panel {
  border-radius: 20px;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f7ff 100%);
}

.status-label {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
  color: #6b7280;
}

.status-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.status-subtext {
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
}

.with-piece {
  display: flex;
  align-items: center;
  gap: 10px;
}

.piece-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.18);
}

.piece-dot.black {
  background: radial-gradient(circle at 30% 30%, #4b5563 0%, #111827 70%, #020617 100%);
}

.piece-dot.white {
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f3f4f6 65%, #d1d5db 100%);
  border: 1px solid rgba(148, 163, 184, 0.8);
}

.status-alert {
  margin-bottom: 24px;
  border-radius: 18px;
}

.board-section {
  display: flex;
  justify-content: center;
}

.board {
  width: min(100%, 720px);
  aspect-ratio: 1;
  display: grid;
  grid-template-columns: repeat(15, minmax(0, 1fr));
  grid-template-rows: repeat(15, minmax(0, 1fr));
  padding: 16px;
  border-radius: 24px;
  background: linear-gradient(180deg, #ddb173 0%, #cf9858 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.2),
    0 18px 35px rgba(120, 88, 39, 0.18);
}

.cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease;
}

.cell::before,
.cell::after {
  content: '';
  position: absolute;
  background: rgba(104, 63, 25, 0.78);
}

.cell::before {
  width: 100%;
  height: 1px;
}

.cell::after {
  width: 1px;
  height: 100%;
}

.cell:not(.occupied):not(.game-over):hover {
  background: rgba(255, 255, 255, 0.16);
  transform: scale(1.03);
}

.cell:disabled {
  cursor: default;
}

.piece {
  position: relative;
  z-index: 1;
  width: 72%;
  height: 72%;
  border-radius: 50%;
  box-shadow:
    inset -4px -4px 9px rgba(255, 255, 255, 0.18),
    inset 4px 4px 10px rgba(15, 23, 42, 0.24),
    0 5px 10px rgba(15, 23, 42, 0.2);
}

.piece.black {
  background: radial-gradient(circle at 30% 30%, #6b7280 0%, #1f2937 65%, #020617 100%);
}

.piece.white {
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 60%, #dbe2ea 100%);
  border: 1px solid rgba(148, 163, 184, 0.65);
}

.last-move .piece {
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.32),
    inset -4px -4px 9px rgba(255, 255, 255, 0.18),
    inset 4px 4px 10px rgba(15, 23, 42, 0.24),
    0 5px 10px rgba(15, 23, 42, 0.2);
}

.board-tip {
  margin: 18px 0 0;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

@media (max-width: 900px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .page-shell {
    padding: 20px 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .game-card {
    border-radius: 22px;
  }

  .board {
    padding: 10px;
    border-radius: 18px;
  }

  .status-value {
    font-size: 20px;
  }
}
</style>
