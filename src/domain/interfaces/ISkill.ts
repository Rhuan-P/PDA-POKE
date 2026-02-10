/**
 * Interface para Skill - Habilidade
 * Responsabilidade: Definir características e dados de uma habilidade
 */
export interface ISkill {
  id: string;
  name: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  power: number;
  cooldown: number;
  description: string;
  cost?: number;
  accuracy: number;
  target: 'self' | 'enemy' | 'all';
}

export interface ISkillMethods {
  // Consultas
  isReady(lastUsed: number, currentTurn: number): boolean;
  getCooldownRemaining(lastUsed: number, currentTurn: number): number;
  
  // Validações
  isValid(): boolean;
  
  // Serialização
  toJSON(): object;
  fromJSON(data: object): ISkill;
}
