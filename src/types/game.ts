export interface GameState {
  board: number[][];
  score: number;
  gameOver: boolean;
}

export interface Player {
  id: number;
  name: string;
  gameState: GameState;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameProps {
  player: Player;
  onMove: (direction: Direction) => void;
}

export interface ScoreboardProps {
  player1: Player;
  player2: Player;
}