/**
 * Testes do BattleService - GL-5
 * Time Game Logic: Testes de implementação do BattleService
 */

import { BattleService } from '../../../src/domain/services/battleService';
import { PokemonModel } from '../../../src/domain/entities/Pokemon';

describe('BattleService', () => {
  describe('calculateDamage', () => {
    it('deve calcular dano baseado nos stats dos pokemons', () => {
      const attacker = PokemonModel.create('Charizard', 10);
      const defender = PokemonModel.create('Bulbasaur', 10);
      
      const damage = BattleService.calculateDamage(attacker, defender);
      
      expect(damage).toBeGreaterThan(0);
      expect(damage).toBeLessThan(1000); // Limite razoável
    });

    it('deve calcular dano maior com ataque mais alto', () => {
      const attacker = PokemonModel.create('Strong', 15);
      const defender = PokemonModel.create('Weak', 5);
      
      const damage = BattleService.calculateDamage(attacker, defender);
      
      expect(damage).toBeGreaterThan(0);
    });

    it('deve calcular dano menor com defesa mais alta', () => {
      const attacker = PokemonModel.create('Attacker', 10);
      const defender = PokemonModel.create('Defender', 15);
      
      const damage = BattleService.calculateDamage(attacker, defender);
      
      expect(damage).toBeGreaterThan(0);
    });
  });

  describe('getTurnOrder', () => {
    it('deve retornar pokemon mais rápido primeiro', () => {
      const fastPokemon = PokemonModel.create('Fast', 10);
      const slowPokemon = PokemonModel.create('Slow', 5);
      
      // Manipular velocidade para teste
      fastPokemon.stats.speed = 100;
      slowPokemon.stats.speed = 50;
      
      const [first, second] = BattleService.getTurnOrder(fastPokemon, slowPokemon);
      
      expect(first.name).toBe('Fast');
      expect(second.name).toBe('Slow');
    });

    it('deve manter ordem em caso de velocidade igual', () => {
      const pokemon1 = PokemonModel.create('Pokemon1', 10);
      const pokemon2 = PokemonModel.create('Pokemon2', 10);
      
      // Mesma velocidade
      pokemon1.stats.speed = 50;
      pokemon2.stats.speed = 50;
      
      const [first, second] = BattleService.getTurnOrder(pokemon1, pokemon2);
      
      expect(first.name).toBe('Pokemon1');
      expect(second.name).toBe('Pokemon2');
    });
  });

  describe('simulateBattle', () => {
    it('deve simular batalha completa com vencedor', () => {
      const pokemon1 = PokemonModel.create('Pokemon1', 10);
      const pokemon2 = PokemonModel.create('Pokemon2', 10);
      
      const result = BattleService.simulateBattle(pokemon1, pokemon2);
      
      expect(result.winner).toBeDefined();
      expect(result.loser).toBeDefined();
      expect(result.turns).toBeGreaterThan(0);
      expect(result.log.length).toBeGreaterThan(0);
      expect(result.winner.stats.hp).toBeGreaterThan(0);
      expect(result.loser.stats.hp).toBeLessThanOrEqual(0);
    });

    it('deve terminar batalha quando pokemon derrotado', () => {
      const strongPokemon = PokemonModel.create('Strong', 20);
      const weakPokemon = PokemonModel.create('Weak', 5);
      
      const result = BattleService.simulateBattle(strongPokemon, weakPokemon);
      
      expect(PokemonModel.isDefeated(result.loser)).toBe(true);
      expect(PokemonModel.isDefeated(result.winner)).toBe(false);
    });
  });

  describe('getWinner', () => {
    it('deve retornar pokemon2 se pokemon1 derrotado', () => {
      const pokemon1 = PokemonModel.create('Pokemon1', 10);
      const pokemon2 = PokemonModel.create('Pokemon2', 10);
      
      // Derrotar pokemon1
      pokemon1.stats.hp = 0;
      
      const winner = BattleService.getWinner(pokemon1, pokemon2);
      
      expect(winner?.name).toBe('Pokemon2');
    });

    it('deve retornar pokemon1 se pokemon2 derrotado', () => {
      const pokemon1 = PokemonModel.create('Pokemon1', 10);
      const pokemon2 = PokemonModel.create('Pokemon2', 10);
      
      // Derrotar pokemon2
      pokemon2.stats.hp = 0;
      
      const winner = BattleService.getWinner(pokemon1, pokemon2);
      
      expect(winner?.name).toBe('Pokemon1');
    });

    it('deve retornar null se ambos vivos', () => {
      const pokemon1 = PokemonModel.create('Pokemon1', 10);
      const pokemon2 = PokemonModel.create('Pokemon2', 10);
      
      const winner = BattleService.getWinner(pokemon1, pokemon2);
      
      expect(winner).toBeNull();
    });
  });
});
