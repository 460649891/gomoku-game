import { ref, computed } from 'vue'

export const BOARD_SIZE = 15
export const EMPTY = 0
export const BLACK = 1
export const WHITE = 2

export function useGomoku() {
  const createEmptyBoard = () =>
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY))

  const boardState = ref(createEmptyBoard())
  const currentPlayer = ref(BLACK)
  const isGameOver = ref(false)
  const winner = ref(EMPTY)
  const winningPath = ref([])
  const lastMove = ref(null)
  const moveHistory = ref([])
  const gameMessage = ref('请黑子先行。')

  const moveCount = computed(() => moveHistory.value.length)

  function getPlayerLabel(playerValue) {
    return playerValue === BLACK ? '黑子' : '白子'
  }

  function handleMove(row, col) {
    if (isGameOver.value || boardState.value[row][col] !== EMPTY) {
      if (boardState.value[row][col] !== EMPTY && !isGameOver.value) {
        gameMessage.value = '此处已有棋子，请另择一处。'
      }
      return
    }

    const player = currentPlayer.value
    boardState.value[row][col] = player
    lastMove.value = { row, col }
    moveHistory.value.push({ row, col, player })

    const path = checkWin(row, col, player)
    if (path) {
      winner.value = player
      isGameOver.value = true
      winningPath.value = path
      gameMessage.value = `${getPlayerLabel(player)}已成五连，胜局已定！`
      return
    }

    currentPlayer.value = player === BLACK ? WHITE : BLACK
    gameMessage.value = `请${getPlayerLabel(currentPlayer.value)}落子。`
  }

  function undoMove() {
    if (moveHistory.value.length === 0 || isGameOver.value) {
      gameMessage.value = isGameOver.value ? '对局已结束，无法悔棋。' : '棋盘已空。'
      return
    }

    const last = moveHistory.value.pop()
    boardState.value[last.row][last.col] = EMPTY
    
    // 恢复到上一步的状态
    if (moveHistory.value.length > 0) {
      const prev = moveHistory.value[moveHistory.value.length - 1]
      lastMove.value = { row: prev.row, col: prev.col }
      currentPlayer.value = prev.player === BLACK ? WHITE : BLACK
    } else {
      lastMove.value = null
      currentPlayer.value = BLACK
    }
    
    isGameOver.value = false
    winner.value = EMPTY
    winningPath.value = []
    gameMessage.value = `已撤销落子。请${getPlayerLabel(currentPlayer.value)}落子。`
  }

  function checkWin(row, col, playerValue) {
    const directions = [
      [0, 1],  // 横
      [1, 0],  // 竖
      [1, 1],  // 主对角
      [1, -1]  // 副对角
    ]

    for (const [rowStep, colStep] of directions) {
      const forward = getContinuousPieces(row, col, rowStep, colStep, playerValue)
      const backward = getContinuousPieces(row, col, -rowStep, -colStep, playerValue)
      
      // forward 和 backward 都包含了起始点 (row, col)
      const path = [...forward, ...backward.slice(1)]
      
      if (path.length >= 5) {
        return path
      }
    }
    return null
  }

  function getContinuousPieces(startRow, startCol, rowStep, colStep, playerValue) {
    const pieces = []
    let r = startRow
    let c = startCol

    while (
      r >= 0 && r < BOARD_SIZE &&
      c >= 0 && c < BOARD_SIZE &&
      boardState.value[r][c] === playerValue
    ) {
      pieces.push({ row: r, col: c })
      r += rowStep
      c += colStep
    }
    return pieces
  }

  function resetGame() {
    boardState.value = createEmptyBoard()
    currentPlayer.value = BLACK
    isGameOver.value = false
    winner.value = EMPTY
    winningPath.value = []
    lastMove.value = null
    moveHistory.value = []
    gameMessage.value = '请黑子先行。'
  }

  return {
    boardState,
    currentPlayer,
    isGameOver,
    winner,
    winningPath,
    lastMove,
    moveHistory,
    moveCount,
    gameMessage,
    handleMove,
    undoMove,
    resetGame,
    getPlayerLabel
  }
}
