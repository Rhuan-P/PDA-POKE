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
  // TODO: Time Game Logic - Definir estrutura de cÃ¡lculo
  baseStats: PokemonStats;
  modifiedStats: PokemonStats;
  levelMultiplier: number;
}

export class StatCalculator {
  /**
   * TODO: Time Game Logic - Implementar cÃ¡lculo por nÃ­vel
   * FÃ³rmula: stat = (baseStat * level / 50) + 5
   */
  static calculateByLevel(baseStat: number, level: number): number {
    return Math.floor((baseStat * level) / 50) + 5;
  }

  /**
   * TODO: Time Game Logic - Implementar cÃ¡lculo de todos os stats
   */
  static calculateAllStats(baseStats: PokemonStats, level: number): PokemonStats {
    const calculatedHp = this.calculateByLevel(baseStats.hp, level);
    return {
      hp: calculatedHp,
      maxHp: calculatedHp,
      attack: this.calculateByLevel(baseStats.attack, level),
      defense: this.calculateByLevel(baseStats.defense, level),
      speed: this.calculateByLevel(baseStats.speed, level),
    };
  }

  /**
   * TODO: Time Game Logic - Implementar modificadores
   * Aplicar buffs/debuffs nos stats
   */
  static applyModifiers(stats: PokemonStats, modifiers: Partial<PokemonStats>): PokemonStats {
    return {
      hp: modifiers.hp !== undefined ? stats.hp + modifiers.hp : stats.hp,
      maxHp: modifiers.maxHp !== undefined ? stats.maxHp + modifiers.maxHp : stats.maxHp,
      attack: modifiers.attack !== undefined ? stats.attack + modifiers.attack : stats.attack,
      defense: modifiers.defense !== undefined ? stats.defense + modifiers.defense : stats.defense,
      speed: modifiers.speed !== undefined ? stats.speed + modifiers.speed : stats.speed,
    };
  }

  /**
   * TODO: Time Game Logic - Implementar vantagem de tipo
   * Matriz de eficÃ¡cia: fire > grass, water > fire, etc
   */
  static getTypeAdvantage(attackerType: string, defenderType: string): number {
    const effectivenessChart: Record<string, Record<string, number>> = {
      fire: { grass: 2, water: 0.5, ice: 2, bug: 0.5, rock: 0.5, dragon: 0.5 },
      water: { fire: 2, grass: 0.5, ice: 0.5, rock: 2, dragon: 0.5 },
      grass: { fire: 0.5, water: 2, ice: 0.5, bug: 2, rock: 2, dragon: 0.5 },
      electric: { water: 2, grass: 0.5, ice: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5 },
      normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    };

    return effectivenessChart[attackerType]?.[defenderType] ?? 1;
  }

  /**
   * TODO: Time Game Logic - Implementar cÃ¡lculo de dano completo
   * Considerar todos os fatores: stats, nÃ­vel, tipo, etc
   */
  static calculateDamage(
    attacker: Pokemon,
    defender: Pokemon,
    baseDamage: number = 10
  ): number {
    const typeAdvantage = this.getTypeAdvantage(
      attacker.types[0] || 'normal',
      defender.types[0] || 'normal'
    );

    const attack = attacker.stats.attack;
    const defense = defender.stats.defense;

    const damage = Math.max(1, Math.floor((attack / defense) * baseDamage * typeAdvantage));

    return damage;
  }
}


