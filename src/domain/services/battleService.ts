/**
 * ServiÃ§o de Batalha - LÃ³gica pura do combate
 * Time Game Logic: Implementar aqui as regras de batalha
 * 
 * O que implementar:
 * - CÃ¡lculo de dano baseado em stats
 * - DeterminaÃ§Ã£o de ordem de turno
 * - SimulaÃ§Ã£o de batalha completa
 * - ValidaÃ§Ãµes de regras do jogo
 */

import { Pokemon } from '../entities/Pokemon';
import { PokemonModel } from '../entities/Pokemon';
import { DamageCalculator } from '../calculators/DamageCalculator';

export interface BattleResult {
  // TODO: Time Game Logic - Definir estrutura de resultado
  winner: Pokemon;
  loser: Pokemon;
  turns: number;
  log: string[];
}

export class BattleService {
  /**
   * TODO: Time Game Logic - Implementar cálculo de dano
   * Fórmula: (ataque / defesa) * baseDamage * eficácia_tipo
   */
  static calculateDamage(attacker: Pokemon, defender: Pokemon): number {
    const basePower = 40; // Poder base padrão para ataques simples
    const effectiveness = 1; // Por enquanto, sem sistema de tipos implementado
    
    return DamageCalculator.calculate({
      attack: attacker.stats.attack,
      defense: defender.stats.defense,
      power: basePower,
      effectiveness,
      stab: 1, // Sem STAB por enquanto
      critical: 1 // Sem crítico por enquanto
    });
  }

  /**
   * TODO: Time Game Logic - Implementar ordem de turno
   * Baseado na velocidade dos PokÃ©mons
   */
  static getTurnOrder(pokemon1: Pokemon, pokemon2: Pokemon): [Pokemon, Pokemon] {
    if (pokemon1.stats.speed >= pokemon2.stats.speed) {
  return [pokemon1, pokemon2];
}
return [pokemon2, pokemon1];
  }
  /**
   * TODO: Time Game Logic - Implementar simulaÃ§Ã£o completa
   * Executar batalha atÃ© um PokÃ©mon ser derrotado
   */
  static simulateBattle(pokemon1: Pokemon, pokemon2: Pokemon): BattleResult {
    let p1 = pokemon1;
let p2 = pokemon2;
let turns = 0;
const log: string[] = [];

while (p1.stats.hp > 0 && p2.stats.hp > 0) {
  turns++;

  const [first, second] = this.getTurnOrder(p1, p2);

  const damage1 = this.calculateDamage(first, second);
  const updatedSecond = PokemonModel.takeDamage(second, damage1);

  log.push(`${first.name} causou ${damage1} de dano em ${second.name}`);

  if (updatedSecond.stats.hp <= 0) {
    return {
      winner: first,
      loser: updatedSecond,
      turns,
      log
    };
  }

  const damage2 = this.calculateDamage(updatedSecond, first);
  const updatedFirst = PokemonModel.takeDamage(first, damage2);

  log.push(`${updatedSecond.name} causou ${damage2} de dano em ${first.name}`);

  p1 = updatedFirst;
  p2 = updatedSecond;
}

return {
  winner: p1.stats.hp > 0 ? p1 : p2,
  loser: p1.stats.hp <= 0 ? p1 : p2,
  turns,
  log
};
  }

  /**
   * TODO: Time Game Logic - Implementar verificaÃ§Ã£o de vitÃ³ria
   */
  static getWinner(pokemon1: Pokemon, pokemon2: Pokemon): Pokemon | null {
    if (pokemon1.stats.hp <= 0) return pokemon2;
if (pokemon2.stats.hp <= 0) return pokemon1;
return null;
  
  }
}

