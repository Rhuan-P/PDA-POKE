/**
 * Serviço PokeAPI - Comunicação com API externa
 * Time UX: Implementar aqui a comunicação com APIs
 *
 * O que implementar:
 * - Busca de Pokémon por nome/ID
 * - Tratamento de erros
 * - Cache de requisições
 * - Normalização de dados
 */

import { apiClient } from './api-client.js';
import { createCache } from './utils/cache.js';
import { normalizePokemon } from './utils/data-transformer.js';

const cache = createCache();

/**
 * @typedef {Object} PokemonAPI
 * @property {number} id
 * @property {string} name
 * @property {number} height
 * @property {number} weight
 * @property {Array<any>} stats
 * @property {Array<any>} types
 * @property {{ front_default: string, back_default: string }} sprites
 */

export class PokeApiService {
  /**
   * Busca Pokémon por nome/ID e normaliza dados.
   * @param {string} nameOrId
   */
  async fetchPokemon(nameOrId) {
    const key = `pokemon:${nameOrId}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const data = await apiClient.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    const normalized = normalizePokemon(data);
    cache.set(key, normalized);
    return normalized;
  }

  /**
   * Busca múltiplos Pokémon por termo (MVP simples).
   * @param {string} query
   */
  async searchPokemon(query) {
    // TODO: implementar busca real por termo (MVP: lista e filtro)
    const list = await this.getPokemonList(151);
    return list.filter((p) => p.name.includes(query.toLowerCase()));
  }

  /**
   * Retorna lista básica de Pokémon.
   * @param {number} limit
   */
  async getPokemonList(limit = 151) {
    const key = `pokemon:list:${limit}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const data = await apiClient.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const results = data.results ?? [];
    cache.set(key, results);
    return results;
  }

  /**
   * Busca skill (stub para mocks e integrações futuras).
   * @param {string} skillId
   */
  async getSkill(skillId) {
    // TODO: integrar com API de skills
    return { id: skillId, type: 'normal', power: 10 };
  }

  /**
   * Busca Pokémon por nome (alias).
   * @param {string} name
   */
  async getPokemonByName(name) {
    return this.fetchPokemon(name);
  }

  /**
   * Busca Pokémon por id (alias).
   * @param {string} id
   */
  async getPokemon(id) {
    return this.fetchPokemon(id);
  }
}

// Export singleton para uso na aplicação
export const pokeApiService = new PokeApiService();
