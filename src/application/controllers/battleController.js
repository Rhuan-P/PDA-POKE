/**
 * Controller de Batalha - Versão JavaScript para Backend
 * Adaptado do TypeScript original
 */

// Classe Pokemon simplificada para o backend
class Pokemon {
  constructor(id, name, stats, types) {
    this.id = id;
    this.name = name;
    this.stats = stats || {
      hp: 100,
      attack: 50,
      defense: 50,
      speed: 50
    };
    this.types = types || ['normal'];
    this.currentHp = this.stats.hp;
    this.level = 50;
  }

  takeDamage(damage) {
    this.currentHp = Math.max(0, this.currentHp - damage);
    return this.currentHp;
  }

  heal(amount) {
    this.currentHp = Math.min(this.stats.hp, this.currentHp + amount);
    return this.currentHp;
  }

  isFainted() {
    return this.currentHp <= 0;
  }

  getHpPercentage() {
    return Math.round((this.currentHp / this.stats.hp) * 100);
  }
}

export class BattleControllerImpl {
  constructor() {
    this.player1Pokemon = null;
    this.player2Pokemon = null;
    this.currentTurn = 1;
    this.battleActive = false;
  }

  async selectPokemon(playerId, pokemonName) {
    try {
      console.log(`🔍 DEBUG: selectPokemon - playerId: ${playerId}, pokemonName: ${pokemonName}`);

      // Importar pokeApiService dinamicamente para evitar circular dependency
      const { pokeApiService } = await import('../../services/pokeApiService.js');
      const pokemonData = await pokeApiService.getPokemon(pokemonName);

      console.log(`🔍 DEBUG: pokemonData recebido:`, pokemonData);

      const pokemon = new Pokemon(
        pokemonData.id,
        pokemonData.name,
        pokemonData.stats,
        pokemonData.types
      );

      console.log(`🔍 DEBUG: Pokemon criado:`, {
        id: pokemon.id,
        name: pokemon.name,
        hp: pokemon.currentHp,
        maxHp: pokemon.stats.hp,
        attack: pokemon.stats.attack,
        defense: pokemon.stats.defense,
        speed: pokemon.stats.speed
      });

      if (playerId === 1) {
        this.player1Pokemon = pokemon;
        console.log(`🔍 DEBUG: player1Pokemon definido:`, this.player1Pokemon.name);
      } else if (playerId === 2) {
        this.player2Pokemon = pokemon;
        console.log(`🔍 DEBUG: player2Pokemon definido:`, this.player2Pokemon.name);
      }

      return pokemon;
    } catch (error) {
      console.error(`❌ DEBUG: Erro em selectPokemon:`, error);
      throw new Error(`Failed to select Pokemon: ${error.message}`);
    }
  }

  startBattle() {
    console.log(`🔍 DEBUG: startBattle iniciado`);
    console.log(`🔍 DEBUG: player1Pokemon:`, this.player1Pokemon);
    console.log(`🔍 DEBUG: player2Pokemon:`, this.player2Pokemon);

    if (!this.player1Pokemon || !this.player2Pokemon) {
      throw new Error('Both players must select a Pokemon before starting battle');
    }

    this.battleActive = true;
    this.currentTurn = this.player1Pokemon.stats.speed >= this.player2Pokemon.stats.speed ? 1 : 2;

    console.log(`🔍 DEBUG: Batalha iniciada - currentTurn: ${this.currentTurn}`);

    return {
      status: 'started',
      player1: this.player1Pokemon.name,
      player2: this.player2Pokemon.name,
      currentTurn: this.currentTurn
    };
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
      turn: this.currentTurn,
      attacker: attacker.name,
      defender: defender.name,
      action: action,
      damage: 0,
      effectiveness: 'normal'
    };

    // Processar diferentes tipos de ação
    if (typeof action === 'string') {
      // Ação simples (legado)
      if (action === 'attack') {
        const baseDamage = attacker.stats.attack;
        const defense = defender.stats.defense;
        const randomFactor = 0.85 + Math.random() * 0.15;

        result.damage = Math.max(1, Math.floor(((2 * 50 + 10) / 250 * (baseDamage / defense) * 50 + 2) * randomFactor));
        defender.takeDamage(result.damage);
      }
    } else if (typeof action === 'object' && action.name) {
      // Ação com dados completos de ataque
      const attackPower = action.power || 50;
      const attackType = action.type || 'normal';

      // Cálculo de dano com poder do ataque
      const baseDamage = attacker.stats.attack;
      const defense = defender.stats.defense;
      const randomFactor = 0.85 + Math.random() * 0.15;

      // Fórmula de dano considerando o poder do ataque
      result.damage = Math.max(1, Math.floor(((2 * 50 + 10) / 250 * (baseDamage / defense) * attackPower + 2) * randomFactor));

      // Adicionar informações do ataque ao resultado
      result.attackName = action.name;
      result.attackType = attackType;
      result.attackPower = attackPower;

      defender.takeDamage(result.damage);

      console.log(`🔥 DEBUG: ${attacker.name} usou ${action.name} (Poder: ${attackPower}) → ${defender.name} (Dano: ${result.damage})`);
    }

    // Verificar se batalha acabou
    if (defender.isFainted()) {
      this.battleActive = false;
      result.winner = attacker.name;
      result.battleEnded = true;
    }

    // Adicionar dados de HP atualizados na resposta
    result.attackerHp = attacker.currentHp;
    result.defenderHp = defender.currentHp;

    // Alternar turno
    if (this.battleActive) {
      this.currentTurn = this.currentTurn === 1 ? 2 : 1;
    }
    result.nextTurn = this.currentTurn;

    return result;
  }

  resetBattle() {
    this.player1Pokemon = null;
    this.player2Pokemon = null;
    this.currentTurn = 1;
    this.battleActive = false;
    return { status: 'reset' };
  }

  getBattleStatus() {
    return {
      player1Pokemon: this.player1Pokemon,
      player2Pokemon: this.player2Pokemon,
      battleActive: this.battleActive,
      currentTurn: this.currentTurn
    };
  }
}

export const battleController = new BattleControllerImpl();
