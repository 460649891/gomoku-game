<script setup>
import { BLACK } from '../composables/useGomoku'

defineProps({
  currentPlayer: Number,
  currentPlayerLabel: String,
  gameStatusLabel: String,
  winnerLabel: String,
  moveCount: Number,
  gameMessage: String,
  alertType: String,
  isGameOver: Boolean,
  canUndo: Boolean
})

defineEmits(['undo', 'reset'])
</script>

<template>
  <div class="status-container">
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
        <div class="status-subtext">15 × 15 棋盘</div>
      </el-card>
    </div>

    <el-alert
      class="status-alert"
      :title="gameMessage"
      :type="alertType"
      :closable="false"
      show-icon
    />

    <div class="actions">
      <el-button 
        type="warning" 
        size="large" 
        plain 
        round 
        :disabled="!canUndo"
        @click="$emit('undo')"
      >
        悔棋
      </el-button>
      <el-button 
        type="primary" 
        size="large" 
        round 
        @click="$emit('reset')"
      >
        重新开始
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.status-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.status-panel {
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.status-label {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.status-value {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}

.with-piece {
  display: flex;
  align-items: center;
  gap: 8px;
}

.piece-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.piece-dot.black { background: #000; }
.piece-dot.white { background: #fff; border: 1px solid #d1d5db; }

.status-subtext {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.status-alert {
  border-radius: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}
</style>
