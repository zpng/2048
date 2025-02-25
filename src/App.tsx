import { useState, useCallback } from 'react';
import { Player, Direction, GameState } from './types/game';
import { Game } from './components/Game';
import './App.css';

const createInitialBoard = (): number[][] => {
  const board = Array(4).fill(null).map(() => Array(4).fill(0));
  // 在随机位置添加两个初始数字（2或4）
  addRandomNumber(board);
  addRandomNumber(board);
  return board;
};

const addRandomNumber = (board: number[][]): void => {
  const emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ i, j });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
};

const moveBoard = (board: number[][], direction: Direction): { newBoard: number[][], score: number } => {
  let score = 0;
  const newBoard = board.map(row => [...row]);
  const size = newBoard.length;

  const rotate = (board: number[][]): number[][] => {
    const rotated = Array(size).fill(null).map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        rotated[i][j] = board[size - 1 - j][i];
      }
    }
    return rotated;
  };

  const moveLeft = (board: number[][]): void => {
    for (let i = 0; i < size; i++) {
      let column = 0;
      for (let j = 1; j < size; j++) {
        if (board[i][j] !== 0) {
          if (board[i][column] === 0) {
            board[i][column] = board[i][j];
            board[i][j] = 0;
          } else if (board[i][column] === board[i][j]) {
            board[i][column] *= 2;
            score += board[i][column];
            board[i][j] = 0;
            column++;
          } else {
            column++;
            if (column !== j) {
              board[i][column] = board[i][j];
              board[i][j] = 0;
            }
          }
        }
      }
    }
  };

  // 根据方向旋转棋盘
  let rotations = 0;
  if (direction === 'up') rotations = 1;
  else if (direction === 'right') rotations = 2;
  else if (direction === 'down') rotations = 3;

  // 旋转到正确的方向
  for (let i = 0; i < rotations; i++) {
    newBoard.splice(0, size, ...rotate(newBoard));
  }

  moveLeft(newBoard);

  // 旋转回原来的方向
  for (let i = 0; i < (4 - rotations) % 4; i++) {
    newBoard.splice(0, size, ...rotate(newBoard));
  }

  return { newBoard, score };
};

const checkGameOver = (board: number[][]): boolean => {
  // 检查是否有空格
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return false;
    }
  }

  // 检查是否有相邻的相同数字
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (j < 3 && board[i][j] === board[i][j + 1]) return false;
      if (i < 3 && board[i][j] === board[i + 1][j]) return false;
    }
  }

  return true;
};

function App() {
  const [player1, setPlayer1] = useState<Player>({
    id: 1,
    name: 'Player 1',
    gameState: {
      board: createInitialBoard(),
      score: 0,
      gameOver: false
    }
  });

  const [player2, setPlayer2] = useState<Player>({
    id: 2,
    name: 'Player 2',
    gameState: {
      board: createInitialBoard(),
      score: 0,
      gameOver: false
    }
  });

  const handleMove = useCallback((playerId: number, direction: Direction) => {
    const updatePlayer = (player: Player): Player => {
      if (player.gameState.gameOver) return player;

      const { newBoard, score } = moveBoard(player.gameState.board, direction);
      const boardChanged = JSON.stringify(newBoard) !== JSON.stringify(player.gameState.board);

      if (!boardChanged) return player;

      addRandomNumber(newBoard);
      const gameOver = checkGameOver(newBoard);

      return {
        ...player,
        gameState: {
          board: newBoard,
          score: player.gameState.score + score,
          gameOver
        }
      };
    };

    if (playerId === 1) {
      setPlayer1(prev => updatePlayer(prev));
    } else {
      setPlayer2(prev => updatePlayer(prev));
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      <Game player={player1} onMove={(direction) => handleMove(1, direction)} />
      <Game player={player2} onMove={(direction) => handleMove(2, direction)} />
    </div>
  );
}

export default App;
