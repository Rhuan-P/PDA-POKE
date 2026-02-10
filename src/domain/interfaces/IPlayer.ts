/**
 * Interface para Player - Jogador
 * Responsabilidade: Representar um participante da batalha PVP
 */
import { ISkill } from './ISkill';

export interface IPlayer {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  skills: ISkill[];
  status: 'active' | 'defeated' | 'waiting';
  lastActionTime?: number;
  position?: { x: number; y: number };
}

export interface IPlayerMethods {
  // Consultas de estado
  isAlive(): boolean;
  isDefeated(): boolean;
  canAct(currentTime: number): boolean;
  
  // Modificações de estado
  takeDamage(damage: number): void;
  heal(amount: number): void;
  useSkill(skillId: string): boolean;
  
  // Habilidades
  getAvailableSkills(): ISkill[];
  hasSkill(skillId: string): boolean;
  
  // Serialização
  toJSON(): object;
  fromJSON(data: object): IPlayer;
}
