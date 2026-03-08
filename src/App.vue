<script setup>
import { computed } from 'vue'
import { useGomoku, EMPTY } from './composables/useGomoku'
import GomokuBoard from './components/GomokuBoard.vue'
import GameStatus from './components/GameStatus.vue'

const {
  boardState,
  currentPlayer,
  isGameOver,
  isDraw,
  winner,
  winningPath,
  lastMove,
  moveCount,
  gameMessage,
  handleMove,
  undoMove,
  resetGame,
  getPlayerLabel
} = useGomoku()

const currentPlayerLabel = computed(() => getPlayerLabel(currentPlayer.value))
// 平局时单独展示结果文案，避免仍显示“未分胜负”。
const winnerLabel = computed(() => {
  if (isDraw.value) {
    return '本局平局'
  }

  return winner.value === EMPTY ? '未分胜负' : `${getPlayerLabel(winner.value)}获胜`
})
const alertType = computed(() => (winner.value !== EMPTY || isDraw.value ? 'success' : 'info'))
const gameStatusLabel = computed(() => {
  if (isDraw.value) {
    return '平局'
  }

  return winner.value !== EMPTY ? '对局已结束' : '对局进行中'
})
const canUndo = computed(() => moveCount.value > 0 && !isGameOver.value)
</script>

<template>
  <div class="page-shell">
    <div class="bg-decoration">
       <div class="circle circle-1"></div>
       <div class="circle circle-2"></div>
    </div>

    <el-card class="game-card" shadow="always">
      <template #header>
        <div class="card-header">
          <div class="brand">
            <h1 class="game-title">万界棋局 · 五子</h1>
            <p class="game-subtitle">纵横挥洒，极简博弈。支持键盘导航 (↑↓←→ + Enter)。</p>
          </div>
        </div>
      </template>

      <div class="main-layout">
        <div class="left-col">
          <GomokuBoard
            :board-state="boardState"
            :last-move="lastMove"
            :winning-path="winningPath"
            :is-game-over="isGameOver"
            :current-player="currentPlayer"
            @move="handleMove"
          />
        </div>

        <div class="right-col">
          <GameStatus
            :current-player="currentPlayer"
            :current-player-label="currentPlayerLabel"
            :game-status-label="gameStatusLabel"
            :winner-label="winnerLabel"
            :move-count="moveCount"
            :game-message="gameMessage"
            :alert-type="alertType"
            :is-game-over="isGameOver"
            :can-undo="canUndo"
            @undo="undoMove"
            @reset="resetGame"
          />
          
          <div class="pro-tip">
            <el-divider content-position="center">小贴士</el-divider>
            <ul>
              <li>五子成线即获胜（含斜线）。</li>
              <li>使用键盘快速定位，运筹帷幄。</li>
              <li>悔棋功能可重温制胜之道。</li>
            </ul>
          </div>
        </div>
      </div>
    </el-card>

    <footer class="game-footer">
      Powered by Vue 3 & Element Plus | 专业重构版
    </footer>
  </div>
</template>

<style>
/* 全局样式覆盖 */
body {
  margin: 0;
  font-family: 'Inter', 'PingFang SC', sans-serif;
  background: #f1f5f9;
  overflow-x: hidden;
}
</style>

<style scoped>
.page-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.circle-1 {
  width: 40vw;
  height: 40vw;
  background: #cbd5e1;
  top: -10vw;
  right: -10vw;
  animation: float 20s infinite alternate;
}

.circle-2 {
  width: 35vw;
  height: 35vw;
  background: #e2e8f0;
  bottom: -5vw;
  left: -5vw;
  animation: float 25s infinite alternate-reverse;
}

@keyframes float {
  from { transform: translate(0, 0); }
  to { transform: translate(50px, 30px); }
}

.game-card {
  width: min(100%, 1120px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
}

.card-header {
  border-bottom: none;
}

.game-title {
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.game-subtitle {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 14px;
}

.main-layout {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 40px;
  align-items: start;
}

.left-col {
  display: flex;
  justify-content: center;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 20px;
}

.pro-tip {
  color: #64748b;
}

.pro-tip ul {
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.6;
}

.game-footer {
  margin-top: 32px;
  color: #94a3b8;
  font-size: 12px;
}

@media (max-width: 960px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .game-card {
    width: 100%;
    border-radius: 0;
  }
  
  .page-shell {
    padding: 0;
    justify-content: flex-start;
  }
}
</style>
