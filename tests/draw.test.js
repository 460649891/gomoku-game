import assert from 'node:assert/strict'
import { useGomoku, BOARD_SIZE } from '../src/composables/useGomoku.js'

function createGame() {
  return useGomoku()
}

function fillBoardToDraw(game) {
  // 采用按行交替的棋谱，并在行首错位，避免形成五连。
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const offset = row % 4 < 2 ? 0 : 1
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const targetCol = (col + offset) % BOARD_SIZE
      game.handleMove(row, targetCol)
    }
  }
}

function testDrawWhenBoardIsFull() {
  const game = createGame()
  fillBoardToDraw(game)

  assert.equal(game.moveCount.value, BOARD_SIZE * BOARD_SIZE)
  assert.equal(game.winner.value, 0)
  assert.equal(game.isDraw.value, true)
  assert.equal(game.isGameOver.value, true)
  assert.equal(game.gameMessage.value, '棋盘已满，本局平局。')
}

function testResetClearsDrawState() {
  const game = createGame()
  fillBoardToDraw(game)
  game.resetGame()

  assert.equal(game.moveCount.value, 0)
  assert.equal(game.isDraw.value, false)
  assert.equal(game.isGameOver.value, false)
  assert.equal(game.gameMessage.value, '请黑子先行。')
}

testDrawWhenBoardIsFull()
testResetClearsDrawState()

console.log('gomoku draw tests passed')
