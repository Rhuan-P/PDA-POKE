/**
 * Interface para GameState - Estado da Partida
 * Responsabilidade: Representar o estado completo de uma batalha em andamento
 */
import { IPlayer } from './IPlayer';

export interface IGameState {
  id: string;
  players: IPlayer[];
  currentTurn: number;
  phase: 'setup' | 'playing' | 'finished';
  winner: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGameStateMethods {
  // Transições de estado
  transitionToPlaying(): void;
  transitionToFinished(winnerId: string): void;
  
  // Atualizações
  addPlayer(player: IPlayer): void;
  removePlayer(playerId: string): void;
  updateTurn(): void;
  
  // Consultas
  isPlayerTurn(playerId: string): boolean;
  getCurrentPlayer(): IPlayer | null;
  isFinished(): boolean;
}
