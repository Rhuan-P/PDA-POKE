import { Pokemon } from '../entities/Pokemon';

export class ActionValidator {
  static validateAttack(attacker: Pokemon, defender: Pokemon): boolean {
    // Validações básicas de ataque
    if (attacker.stats.hp <= 0) return false; // Atacante derrotado não pode atacar
    if (defender.stats.hp <= 0) return false; // Defensor derrotado não pode ser alvo
    if (attacker.stats.speed <= 0) return false; // Sem velocidade não pode atacar
    return true;
  }

  static validateDefend(pokemon: Pokemon): boolean {
    // Validações básicas de defesa
    if (pokemon.stats.hp <= 0) return false; // Derrotado não pode defender
    if (pokemon.stats.speed <= 0) return false; // Sem velocidade não pode defender
    return true;
  }

  static validateUseSkill(pokemon: Pokemon): boolean {
    // Validações básicas de uso de技能
    if (pokemon.stats.hp <= 0) return false; // Derrotado não pode usar技能
    if (pokemon.stats.speed <= 0) return false; // Sem velocidade não pode usar技能
    return true;
  }

  static canAct(pokemon: Pokemon): boolean {
    // Verificação genérica se o pokemon pode agir
    return pokemon.stats.hp > 0 && pokemon.stats.speed > 0;
  }
}
