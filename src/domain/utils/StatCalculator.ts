/**
 * UtilitÃ¡rios de CÃ¡lculo - FunÃ§Ãµes puras para stats
 * Time Game Logic: Implementar aqui cÃ¡lculos matemÃ¡ticos
 * 
 * O que implementar:
 * - CÃ¡lculo de stats baseados em nÃ­vel
 * - Modificadores de status (buffs/debuffs)
 * - Vantagem de tipo
 * - CÃ¡lculo de dano completo
 */

import { Pokemon, PokemonStats } from '../entities/Pokemon';

export interface StatCalculation {
  baseStats: PokemonStats;
  modifiedStats: PokemonStats;
  levelMultiplier: number;
}

export class StatCalculator {

  private static safeNumber(value: number, fallback = 0): number {
    return Number.isFinite(value) ? value : fallback;
  }

  private static clampMin(value: number, min: number): number {
    return value < min ? min : value;
  }

  /**
   * Cálculo por nível
   * Fórmula: stat = (baseStat * level / 50) + 5
   */
  static calculateByLevel(baseStat: number, level: number): number {
    const safeBase = this.clampMin(this.safeNumber(baseStat), 0);
    const safeLevel = this.clampMin(Math.floor(this.safeNumber(level, 1)), 1);

    const value = Math.floor((safeBase * safeLevel) / 50 + 5);

    return this.clampMin(value, 1);
  }

  /**
   * Calcula todos os stats sem mutar o input
   */
  static calculateAllStats(
  baseStats: PokemonStats,
  level: number
): PokemonStats {
  const safeBase = { ...baseStats };

  const newMaxHp = this.calculateByLevel(safeBase.maxHp, level);

  return {
    hp: newMaxHp,
    maxHp: newMaxHp,
    attack: this.calculateByLevel(safeBase.attack, level),
    defense: this.calculateByLevel(safeBase.defense, level),
    speed: this.calculateByLevel(safeBase.speed, level),
  };
}

  /**
   * Aplica buffs/debuffs sem mutar o objeto original
   */
  static applyModifiers(
  stats: PokemonStats,
  modifiers: Partial<PokemonStats>
): PokemonStats {
  const safeStats = { ...stats };

  return {
    hp: Math.max(0, safeStats.hp + (modifiers.hp ?? 0)),
    maxHp: Math.max(1, safeStats.maxHp + (modifiers.maxHp ?? 0)),
    attack: Math.max(0, safeStats.attack + (modifiers.attack ?? 0)),
    defense: Math.max(0, safeStats.defense + (modifiers.defense ?? 0)),
    speed: Math.max(0, safeStats.speed + (modifiers.speed ?? 0)),
  };
}

  /**
   * Vantagem de tipo (matriz simplificada)
   * Retorna multiplicador determinístico
   */
  static getTypeAdvantage(
    attackerType: string,
    defenderType: string
  ): number {
    const matrix: Record<string, Record<string, number>> = {
      fire: { grass: 2, water: 0.5, fire: 1, electric: 1 },
      water: { fire: 2, grass: 0.5, water: 1, electric: 1 },
      grass: { water: 2, fire: 0.5, grass: 1, electric: 1 },
      electric: { water: 2, grass: 1, fire: 1, electric: 1 },
    };

    const atk = attackerType?.toLowerCase?.() ?? '';
    const def = defenderType?.toLowerCase?.() ?? '';

    return matrix[atk]?.[def] ?? 1;
  }

  /**
   * Cálculo de dano completo (determinístico)
   *
   * Fórmula:
   * damage = ((attack / defense) * baseDamage) * typeMultiplier
   */
  static calculateDamage(
    attacker: Pokemon,
    defender: Pokemon,
    baseDamage: number = 10
  ): number {
    const atkStats = attacker?.stats;
    const defStats = defender?.stats;

    const attack = Math.max(1, atkStats?.attack ?? 1);
    const defense = Math.max(1, defStats?.defense ?? 1);
    const power = Math.max(1, this.safeNumber(baseDamage, 10));

  const attackerType = attacker?.types?.[0] ?? '';
const defenderType = defender?.types?.[0] ?? '';

const typeMultiplier = this.getTypeAdvantage(
  attackerType,
  defenderType
);

    const rawDamage = (attack / defense) * power * typeMultiplier;

    return Math.max(1, Math.floor(rawDamage));
  }
}


