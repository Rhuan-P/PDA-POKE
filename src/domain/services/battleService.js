/**
 * Serviço de Batalha - Versão JavaScript para Backend
 */

export class BattleService {
  constructor() {
    this.player1Pokemon = null;
    this.player2Pokemon = null;
    this.currentTurn = 1;
    this.battleActive = false;
    this.turns = [];
  }

  initializeBattle(pokemon1, pokemon2) {
    this.player1Pokemon = pokemon1;
    this.player2Pokemon = pokemon2;
    this.currentTurn = this.player1Pokemon.stats.speed >= this.player2Pokemon.stats.speed ? 1 : 2;
    this.battleActive = true;
    this.turns = [];
  }

  executeTurn(action) {
    if (!this.battleActive) {
      throw new Error('Battle is not active');
    }

    const attacker = this.currentTurn === 1 ? this.player1Pokemon : this.player2Pokemon;
    const defender = this.currentTurn === 1 ? this.player2Pokemon : this.player1Pokemon;

    if (attacker.isFainted()) {
      throw new Error('Attacker is fainted');
    }

    let result = {
      turn: this.turns.length + 1,
      attacker: attacker.name,
      defender: defender.name,
      action: action,
      damage: 0,
      effectiveness: 'normal'
    };

    if (action === 'attack') {
      // Cálculo simples de dano
      const baseDamage = attacker.stats.attack;
      const defense = defender.stats.defense;
      const randomFactor = 0.85 + Math.random() * 0.15; // 85-100%
      
      result.damage = Math.max(1, Math.floor(((2 * attacker.level + 10) / 250 * (baseDamage / defense) * 50 + 2) * randomFactor));
      
      defender.takeDamage(result.damage);
      
      // Verificar se batalha acabou
      if (defender.isFainted()) {
        this.battleActive = false;
        result.winner = attacker.name;
        result.battleEnded = true;
      }
    }

    this.turns.push(result);
    
    // Alternar turno
    if (this.battleActive) {
      this.currentTurn = this.currentTurn === 1 ? 2 : 1;
    }

    return result;
  }

  isBattleActive() {
    return this.battleActive;
  }

  getCurrentTurn() {
    return this.currentTurn;
  }

  getBattleStatus() {
    return {
      player1Pokemon: this.player1Pokemon,
      player2Pokemon: this.player2Pokemon,
      currentTurn: this.currentTurn,
      battleActive: this.battleActive,
      turns: this.turns
    };
  }

  reset() {
    this.player1Pokemon = null;
    this.player2Pokemon = null;
    this.currentTurn = 1;
    this.battleActive = false;
    this.turns = [];
  }
}
