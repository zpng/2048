import React, { useEffect, useCallback } from 'react';
import { GameProps, Direction } from '../types/game';
import '../styles/Game.css';

export const Game: React.FC<GameProps> = ({ player, onMove }) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const keyDirections: { [key: string]: Direction } = {
      ...(player.id === 1 ? {
        KeyW: 'down',
        KeyS: 'up',
        KeyA: 'left',
        KeyD: 'right',
      } : {
        ArrowUp: 'down',
        ArrowDown: 'up',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      })
    };

    const direction = keyDirections[event.code];
    if (direction) {
      event.preventDefault();
      onMove(direction);
    }
  }, [onMove, player.id]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="game-container">
      <div className="player-info">
        <h2>{player.name}</h2>
        <p>Score: {player.gameState.score}</p>
        <div className="controls-info">
          <p>操作说明：</p>
          {player.id === 1 ? (
            <p>使用 WASD 键控制：W(下) S(上) A(左) D(右)</p>
          ) : (
            <p>使用方向键控制：↑(下) ↓(上) ←(左) →(右)</p>
          )}
        </div>
      </div>
      <div className="game-board">
        {player.gameState.board.map((row, i) => (
          <div key={i} className="board-row">
            {row.map((cell, j) => (
              <div key={`${i}-${j}`} className={`cell value-${cell}`}>
                {cell > 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      {player.gameState.gameOver && (
        <div className="game-over">Game Over!</div>
      )}
    </div>
  );
};