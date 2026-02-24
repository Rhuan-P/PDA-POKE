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
    if (!name || typeof name !== 'string') {
      throw new Error('Nome do pokemon inválido');
    }

    if (!Number.isInteger(level) || level < 1) {
      throw new Error('Level do pokemon inválido');
    }

    const trimmedName = name.trim();
    const id = `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${level}`;

    const maxHp = 20 + level * 6;
    const hp = maxHp;
    const attack = 5 + level * 3;
    const defense = 5 + level * 2;
    const speed = 5 + Math.floor(level * 1.5);

    const pokemon: Pokemon = {
      id,
      name: trimmedName,
      level,
      types: ['normal'],
      stats: {
        hp,
        maxHp,
        attack,
        defense,
        speed,
      },
    };

    return pokemon;
  }

  /**
   * TODO: Time Game Logic - Implementar cÃ¡lculo de dano
   * Deve aplicar dano e retornar novo PokÃ©mon imutÃ¡vel
   */
  static takeDamage(pokemon: Pokemon, damage: number): Pokemon {
    if (typeof damage !== 'number' || Number.isNaN(damage) || damage <= 0) {
      return { ...pokemon };
    }

    const applied = Math.max(0, Math.floor(damage));
    const newHp = Math.max(0, pokemon.stats.hp - applied);

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

