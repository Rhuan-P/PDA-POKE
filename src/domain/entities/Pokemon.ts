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
    throw new Error('MÃ©todo a ser implementado pelo Time Game Logic');
  }

  /**
   * TODO: Time Game Logic - Implementar cÃ¡lculo de dano
   * Deve aplicar dano e retornar novo PokÃ©mon imutÃ¡vel
   */
  static takeDamage(pokemon: Pokemon, damage: number): Pokemon {
    throw new Error('MÃ©todo a ser implementado pelo Time Game Logic');
  }

  /**
   * TODO: Time Game Logic - Implementar verificaÃ§Ã£o de derrota
   * Deve verificar se HP <= 0
   */
  static isDefeated(pokemon: Pokemon): boolean {
    throw new Error('MÃ©todo a ser implementado pelo Time Game Logic');
  }
}

