/**
 * Interface para Action - Ação do Jogador
 * Responsabilidade: Definir estrutura de uma ação de forma padronizada
 */
export interface IAction {
  id: string;
  playerId: string;
  type: 'attack' | 'defend' | 'skill' | 'item';
  targetId: string | null;
  skillId: string | null;
  timestamp: number;
  priority: number;
  metadata?: Record<string, any>;
}

export interface IActionMethods {
  // Validações básicas
  isValid(): boolean;
  hasTarget(): boolean;
  requiresSkill(): boolean;
  
  // Comparações
  equals(other: IAction): boolean;
  
  // Serialização
  toJSON(): object;
  fromJSON(data: object): IAction;
}
