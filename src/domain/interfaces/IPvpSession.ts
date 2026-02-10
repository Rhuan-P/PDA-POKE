/**
 * Interface para PvpSession - Sessão PVP
 * Responsabilidade: Gerenciar conexão e comunicação entre dois jogadores
 */
import { IGameState } from './IGameState';

export interface IPvpSession {
  id: string;
  player1Id: string;
  player2Id: string;
  gameState: IGameState;
  status: 'waiting' | 'active' | 'disconnected' | 'finished';
  createdAt: Date;
  lastActivity: Date;
  roomId?: string;
}

export interface IPvpSessionMethods {
  // Gerenciamento de sessão
  startSession(): void;
  endSession(winnerId: string): void;
  disconnectPlayer(playerId: string): void;
  
  // Consultas de estado
  isFull(): boolean;
  isActive(): boolean;
  hasPlayer(playerId: string): boolean;
  getOpponent(playerId: string): string | null;
  
  // Timeout e limpeza
  updateLastActivity(): void;
  isExpired(timeoutMinutes: number): boolean;
  
  // Serialização
  toJSON(): object;
  fromJSON(data: object): IPvpSession;
}
