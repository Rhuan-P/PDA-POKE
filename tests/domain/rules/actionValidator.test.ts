/**
 * Testes do ActionValidator - GL-6
 * Time Game Logic: Testes de validação de ações
 */

import { ActionValidator } from '../../../src/domain/rules/ActionValidator';
import { PokemonModel } from '../../../src/domain/entities/Pokemon';

describe('ActionValidator', () => {
  describe('validateAttack', () => {
    it('deve permitir ataque com pokemon válido', () => {
      const attacker = PokemonModel.create('Attacker', 10);
      const defender = PokemonModel.create('Defender', 10);
      
      const result = ActionValidator.validateAttack(attacker, defender);
      
      expect(result).toBe(true);
    });

    it('deve bloquear ataque com atacante derrotado', () => {
      const attacker = PokemonModel.create('Attacker', 10);
      const defender = PokemonModel.create('Defender', 10);
      
      // Derrotar atacante
      attacker.stats.hp = 0;
      
      const result = ActionValidator.validateAttack(attacker, defender);
      
      expect(result).toBe(false);
    });

    it('deve bloquear ataque com defensor derrotado', () => {
      const attacker = PokemonModel.create('Attacker', 10);
      const defender = PokemonModel.create('Defender', 10);
      
      // Derrotar defensor
      defender.stats.hp = 0;
      
      const result = ActionValidator.validateAttack(attacker, defender);
      
      expect(result).toBe(false);
    });

    it('deve bloquear ataque com pokemon sem velocidade', () => {
      const attacker = PokemonModel.create('Attacker', 10);
      const defender = PokemonModel.create('Defender', 10);
      
      // Sem velocidade
      attacker.stats.speed = 0;
      
      const result = ActionValidator.validateAttack(attacker, defender);
      
      expect(result).toBe(false);
    });
  });

  describe('validateDefend', () => {
    it('deve permitir defesa com pokemon válido', () => {
      const pokemon = PokemonModel.create('Defender', 10);
      
      const result = ActionValidator.validateDefend(pokemon);
      
      expect(result).toBe(true);
    });

    it('deve bloquear defesa com pokemon derrotado', () => {
      const pokemon = PokemonModel.create('Defender', 10);
      
      // Derrotar pokemon
      pokemon.stats.hp = 0;
      
      const result = ActionValidator.validateDefend(pokemon);
      
      expect(result).toBe(false);
    });

    it('deve bloquear defesa com pokemon sem velocidade', () => {
      const pokemon = PokemonModel.create('Defender', 10);
      
      // Sem velocidade
      pokemon.stats.speed = 0;
      
      const result = ActionValidator.validateDefend(pokemon);
      
      expect(result).toBe(false);
    });
  });

  describe('validateUseSkill', () => {
    it('deve permitir uso de技能 com pokemon válido', () => {
      const pokemon = PokemonModel.create('SkillUser', 10);
      
      const result = ActionValidator.validateUseSkill(pokemon);
      
      expect(result).toBe(true);
    });

    it('deve bloquear uso de技能 com pokemon derrotado', () => {
      const pokemon = PokemonModel.create('SkillUser', 10);
      
      // Derrotar pokemon
      pokemon.stats.hp = 0;
      
      const result = ActionValidator.validateUseSkill(pokemon);
      
      expect(result).toBe(false);
    });

    it('deve bloquear uso de技能 com Pokemon sem velocidade', () => {
      const pokemon = PokemonModel.create('SkillUser', 10);
      
      // Sem velocidade
      pokemon.stats.speed = 0;
      
      const result = ActionValidator.validateUseSkill(pokemon);
      
      expect(result).toBe(false);
    });
  });

  describe('canAct', () => {
    it('deve permitir ação com Pokemon válido', () => {
      const pokemon = PokemonModel.create('Active', 10);
      
      const result = ActionValidator.canAct(pokemon);
      
      expect(result).toBe(true);
    });

    it('deve bloquear ação com Pokemon derrotado', () => {
      const pokemon = PokemonModel.create('Defeated', 10);
      
      // Derrotar pokemon
      pokemon.stats.hp = 0;
      
      const result = ActionValidator.canAct(pokemon);
      
      expect(result).toBe(false);
    });

    it('deve bloquear ação com Pokemon sem velocidade', () => {
      const pokemon = PokemonModel.create('Slow', 10);
      
      // Sem velocidade
      pokemon.stats.speed = 0;
      
      const result = ActionValidator.canAct(pokemon);
      
      expect(result).toBe(false);
    });
  });
});
