/**
 * Modelo Pokemon - Estrutura base do PokÃ©mon
 * Time Game Logic: Implementar aqui a entidade Pokemon
 *
 * O que implementar:
 * - Interface Pokemon com stats bÃ¡sicos
 * - Classe PokemonModel com mÃ©todos estÃ¡ticos
 * - ValidaÃ§Ãµes de dados
 * - MÃ©todos de negÃ³cio puros (takeDamage, isDefeated, etc)
 */

export interface PokemonStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Pokemon {
  // TODO: Time Game Logic - Definir propriedades do PokÃ©mon
  id: string;
  name: string;
  level: number;
  types: string[];
  stats: PokemonStats;
  sprite?: string;
}

export class PokemonModel {
  /**
   * TODO: Time Game Logic - Implementar criaÃ§Ã£o de PokÃ©mon
   * Deve criar PokÃ©mon com stats vÃ¡lidos
   */
  static create(name: string, level: number = 1): Pokemon {
    if (!name) {
      throw new Error("Pokemon precisa de um nome");
    }

    if (level <= 0) {
      throw new Error("Level deve ser maior que 0");
    }

    const baseHp = 50 + level * 10;

    return {
      id:
        (globalThis as any).crypto &&
        typeof (globalThis as any).crypto.randomUUID === "function"
          ? (globalThis as any).crypto.randomUUID()
          : `pk_${Math.random().toString(36).slice(2, 9)}`,
      name,
      level,
      types: [],
      stats: {
        hp: baseHp,
        maxHp: baseHp,
        attack: 10 + level * 2,
        defense: 8 + level * 2,
        speed: 5 + level * 2,
      },
    };
  }

  /**
   * TODO: Time Game Logic - Implementar cÃ¡lculo de dano
   * Deve aplicar dano e retornar novo PokÃ©mon imutÃ¡vel
   */
  static takeDamage(pokemon: Pokemon, damage: number): Pokemon {
    if (damage < 0) {
      throw new Error("Dano não pode ser negativo!");
    }

    const newHp = Math.max(0, pokemon.stats.hp - damage);

    return {
      ...pokemon,
      stats: {
        ...pokemon.stats,
        hp: newHp,
      },
    };
  }

  /**
   * TODO: Time Game Logic - Implementar verificaÃ§Ã£o de derrota
   * Deve verificar se HP <= 0
   */
  static isDefeated(pokemon: Pokemon): boolean {
    return pokemon.stats.hp <= 0;
  }
}
