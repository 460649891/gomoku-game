<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BOARD_SIZE, EMPTY, BLACK, WHITE } from '../composables/useGomoku'

const props = defineProps({
  boardState: Array,
  lastMove: Object,
  winningPath: Array,
  isGameOver: Boolean,
  currentPlayer: Number
})

const emit = defineEmits(['move'])

// 键盘焦点位置
const focusedCell = ref({ row: 7, col: 7 })

const labelsX = 'ABCDEFGHIJKLMNO'.split('')
const labelsY = Array.from({ length: BOARD_SIZE }, (_, i) => BOARD_SIZE - i)

function isWinningCell(row, col) {
  return props.winningPath?.some(cell => cell.row === row && cell.col === col)
}

function handleCellClick(row, col) {
  focusedCell.value = { row, col }
  emit('move', row, col)
}

function handleKeyDown(e) {
  if (props.isGameOver) return

  const { row, col } = focusedCell.value
  switch (e.key) {
    case 'ArrowUp':
      if (row > 0) focusedCell.value.row--
      e.preventDefault()
      break
    case 'ArrowDown':
      if (row < BOARD_SIZE - 1) focusedCell.value.row++
      e.preventDefault()
      break
    case 'ArrowLeft':
      if (col > 0) focusedCell.value.col--
      e.preventDefault()
      break
    case 'ArrowRight':
      if (col < BOARD_SIZE - 1) focusedCell.value.col++
      e.preventDefault()
      break
    case 'Enter':
    case ' ':
      emit('move', row, col)
      e.preventDefault()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="board-container">
    <div class="board-layout">
      <!-- 空白占位 -->
      <div class="corner"></div>
      
      <!-- X 轴坐标 -->
      <div class="labels-x">
        <span v-for="label in labelsX" :key="label">{{ label }}</span>
      </div>

      <!-- Y 轴坐标 -->
      <div class="labels-y">
        <span v-for="label in labelsY" :key="label">{{ label }}</span>
      </div>

      <!-- 棋盘主体 -->
      <div class="board-wrapper">
        <div class="board" role="grid" aria-label="五子棋棋盘">
          <template v-for="(row, rowIndex) in boardState" :key="rowIndex">
            <button
              v-for="(cellValue, colIndex) in row"
              :key="`${rowIndex}-${colIndex}`"
              class="cell"
              :class="{
                'is-focused': focusedCell.row === rowIndex && focusedCell.col === colIndex,
                'is-winning': isWinningCell(rowIndex, colIndex),
                'last-move': lastMove?.row === rowIndex && lastMove?.col === colIndex
              }"
              type="button"
              :disabled="isGameOver || cellValue !== EMPTY"
              @click="handleCellClick(rowIndex, colIndex)"
            >
              <!-- 棋子 -->
              <transition name="piece-drop">
                <span
                  v-if="cellValue !== EMPTY"
                  class="piece"
                  :class="cellValue === BLACK ? 'black' : 'white'"
                >
                  <i v-if="isWinningCell(rowIndex, colIndex)" class="win-dot"></i>
                </span>
              </transition>
              
              <!-- 焦点指示器 -->
              <div v-if="focusedCell.row === rowIndex && focusedCell.col === colIndex" class="focus-ring"></div>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  user-select: none;
}

.board-layout {
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-rows: 40px 1fr;
  width: 100%;
  max-width: 720px; /* 适当增大，包含坐标轴 */
}

.labels-x {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  align-items: center;
  justify-items: center;
  color: #64748b;
  font-weight: 700;
  font-size: 14px;
}

.labels-y {
  grid-column: 1;
  grid-row: 2;
  display: grid;
  grid-template-rows: repeat(15, 1fr);
  align-items: center;
  justify-items: center;
  color: #64748b;
  font-weight: 700;
  font-size: 14px;
}

.board-wrapper {
  grid-column: 2;
  grid-row: 2;
  width: 100%;
  aspect-ratio: 1 / 1;
}

.board {
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  grid-template-rows: repeat(15, 1fr);
  width: 100%;
  height: 100%; /* 继承 wrapper 的 aspect-ratio */
  background: #ddb173;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    inset 0 0 100px rgba(0, 0, 0, 0.1);
  position: relative;
}

.cell {
  position: relative;
  aspect-ratio: 1 / 1;
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
}

/* 棋盘线 */
.cell::before, .cell::after {
  content: '';
  position: absolute;
  background: #683f19;
  opacity: 0.6;
}
.cell::before { width: 100%; height: 2px; }
.cell::after { width: 2px; height: 100%; }

/* 边缘线处理 */
.cell:nth-child(15n+1)::before { width: 50%; right: 0; }
.cell:nth-child(15n)::before { width: 50%; left: 0; }
.cell:nth-child(-n+15)::after { height: 50%; bottom: 0; }
.cell:nth-child(n+211)::after { height: 50%; top: 0; }

.piece {
  width: 85%;
  height: 85%;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.piece.black {
  background: radial-gradient(circle at 30% 30%, #4b5563, #000);
}

.piece.white {
  background: radial-gradient(circle at 30% 30%, #fff, #d1d5db);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 获胜特效 */
.is-winning .piece {
  animation: win-pulse 1.5s infinite;
  z-index: 3;
}

@keyframes win-pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
}

.win-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffd700;
}

/* 落子动画 */
.piece-drop-enter-active {
  animation: drop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes drop {
  0% { transform: translateY(-20px) scale(1.2); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

/* 焦点环 */
.focus-ring {
  position: absolute;
  width: 90%;
  height: 90%;
  border: 2px solid rgba(59, 130, 246, 0.8);
  border-radius: 4px;
  z-index: 1;
  pointer-events: none;
  animation: focus-blink 1s infinite alternate;
}

@keyframes focus-blink {
  from { opacity: 0.3; }
  to { opacity: 0.8; }
}

.last-move::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
  z-index: 4;
}
</style>
