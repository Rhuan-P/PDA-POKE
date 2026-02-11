import { Pokemon } from '../../domain/entities/Pokemon';

export interface IBattleUseCase {
  executeAttack(attackerId: string, defenderId: string, skillId: string): Promise<{ damage: number; attacker: Pokemon; defender: Pokemon }>;
}

