import { Pokemon } from '../../domain/entities/Pokemon';

export interface IDamageCalculator {
  calculate(
    attacker: Pokemon,
    defender: Pokemon,
    skill: { type: string; power: number }
  ): number;
}