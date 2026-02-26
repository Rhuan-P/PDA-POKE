/**
 * TurnCalculator - Sistema de cálculo de turnos
 * DevOps Squad - Webhook Battle System
 * 
 * Responsável por calcular ordem de turnos baseada em velocidade,
 * prioridade de habilidades e efeitos de status.
 * 
 * Este serviço será expandido quando Squad A finalizar GL-4 e GL-5.
 */

class TurnCalculator {
  /**
   * Calcular ordem de turnos baseada na velocidade dos Pokémons
   * @param {Object} pokemon1 - Primeiro Pokémon
   * @param {Object} pokemon2 - Segundo Pokémon
   * @returns {Array} - Array com IDs dos Pokémons em ordem de turno
   */
  static calculateTurnOrder(pokemon1, pokemon2) {
    const speed1 = this.getEffectiveSpeed(pokemon1);
    const speed2 = this.getEffectiveSpeed(pokemon2);
    
    // Adicionar fator aleatório (10% da velocidade) para quebrar empates
    const randomFactor1 = Math.random() * speed1 * 0.1;
    const randomFactor2 = Math.random() * speed2 * 0.1;
    
    const finalSpeed1 = speed1 + randomFactor1;
    const finalSpeed2 = speed2 + randomFactor2;
    
    console.log(`🏃 Velocidades: ${pokemon1.name}=${finalSpeed1.toFixed(1)}, ${pokemon2.name}=${finalSpeed2.toFixed(1)}`);
    
    return finalSpeed1 >= finalSpeed2 ? [pokemon1.id, pokemon2.id] : [pokemon2.id, pokemon1.id];
  }

  /**
   * Calcular prioridade de uma habilidade
   * @param {Object} skill - Habilidade a ser usada
   * @param {Object} pokemonStatus - Status do Pokémon
   * @returns {number} - Valor de prioridade (maior = ataca primeiro)
   */
  static calculatePriority(skill, pokemonStatus = {}) {
    let priority = skill.priority || 0;
    
    // Status effects que afetam prioridade
    if (pokemonStatus.paralyzed) {
      priority -= 1; // Paralisia reduz prioridade
    }
    
    if (pokemonStatus.sleeping || pokemonStatus.frozen) {
      priority = -999; // Não pode atacar
    }
    
    if (pokemonStatus.flinching) {
      priority = -998; // Perde o turno
    }
    
    return priority;
  }

  /**
   * Recalcular ordem de turnos considerando status effects
   * @param {Array} players - Array de jogadores com Pokémons
   * @param {Object} statusEffects - Map de status effects por jogador
   * @returns {Array} - Nova ordem de turnos
   */
  static recalculateTurnOrder(players, statusEffects = {}) {
    const playersWithPriority = players.map(player => {
      const pokemon = player.pokemon;
      const status = statusEffects[player.id] || {};
      
      return {
        playerId: player.id,
        pokemonId: pokemon.id,
        name: pokemon.name,
        effectiveSpeed: this.getEffectiveSpeed(pokemon, status),
        priority: 0 // Será calculado por habilidade durante o turno
      };
    });
    
    // Ordenar por velocidade efetiva
    playersWithPriority.sort((a, b) => b.effectiveSpeed - a.effectiveSpeed);
    
    return playersWithPriority.map(p => p.playerId);
  }

  /**
   * Obter velocidade efetiva considerando status effects
   * @param {Object} pokemon - Pokémon
   * @param {Object} status - Status effects
   * @returns {number} - Velocidade efetiva
   */
  static getEffectiveSpeed(pokemon, status = {}) {
    let speed = pokemon.stats.speed || 50;
    
    // Status effects que afetam velocidade
    if (status.paralyzed) {
      speed *= 0.5; // Paralisia reduz velocidade em 50%
    }
    
    if (status.burned) {
      speed *= 0.75; // Queimadura reduz velocidade em 25%
    }
    
    // Stat modifiers (será expandido com GL-4)
    if (status.speedBoost) {
      speed *= (1 + status.speedBoost * 0.25); // +25% por boost
    }
    
    if (status.speedDrop) {
      speed *= (1 - status.speedDrop * 0.25); // -25% por drop
    }
    
    return Math.max(1, Math.floor(speed));
  }

  /**
   * Calcular duração de status effects
   * @param {string} statusType - Tipo de status
   * @returns {number} - Duração em turnos
   */
  static getStatusDuration(statusType) {
    const durations = {
      'sleep': Math.floor(Math.random() * 3) + 1, // 1-3 turnos
      'freeze': Math.floor(Math.random() * 3) + 1, // 1-3 turnos
      'paralyze': -1, // Permanente até curado
      'burn': -1, // Permanente até curado
      'poison': -1, // Permanente até curado
      'confusion': Math.floor(Math.random() * 3) + 1, // 1-3 turnos
      'flinch': 1 // Apenas 1 turno
    };
    
    return durations[statusType] || 0;
  }

  /**
   * Verificar se um Pokémon pode agir no turno
   * @param {Object} pokemon - Pokémon
   * @param {Object} status - Status effects
   * @returns {Object} - Resultado da verificação
   */
  static canAct(pokemon, status = {}) {
    // Verificar HP
    if (pokemon.currentHp <= 0) {
      return { canAct: false, reason: 'derrotado' };
    }
    
    // Verificar status que impedem ação
    if (status.sleeping) {
      return { canAct: false, reason: 'dormindo' };
    }
    
    if (status.frozen) {
      return { canAct: false, reason: 'congelado' };
    }
    
    if (status.flinching) {
      return { canAct: false, reason: 'assustado' };
    }
    
    // Verificar paralisia (50% de chance de não agir)
    if (status.paralyzed) {
      const canMove = Math.random() > 0.5;
      return { 
        canAct: canMove, 
        reason: canMove ? null : 'paralisado' 
      };
    }
    
    return { canAct: true, reason: null };
  }

  /**
   * Calcular chance de acerto baseada em precisão e evasão
   * @param {Object} skill - Habilidade usada
   * @param {Object} attacker - Pokémon atacante
   * @param {Object} defender - Pokémon defensor
   * @param {Object} status - Status effects
   * @returns {number} - Chance de acerto (0-1)
   */
  static calculateAccuracy(skill, attacker, defender, status = {}) {
    let accuracy = skill.accuracy || 100;
    
    // Modificadores de status
    if (status[attacker.id]?.accuracyDrop) {
      accuracy *= (1 - status[attacker.id].accuracyDrop * 0.25);
    }
    
    if (status[defender.id]?.evasionBoost) {
      accuracy *= (1 - status[defender.id].evasionBoost * 0.25);
    }
    
    return Math.max(0, Math.min(1, accuracy / 100));
  }

  /**
   * Determinar se um ataque é crítico
   * @param {Object} attacker - Pokémon atacante
   * @param {Object} skill - Habilidade usada
   * @returns {boolean} - Se é crítico
   */
  static isCriticalHit(attacker, skill) {
    // Taxa base de crítico (6.25% = 1/16)
    let criticalChance = 0.0625;
    
    // Habilidades com high crit rate
    if (skill.highCritRate) {
      criticalChance *= 4; // 25%
    }
    
    // Status effects (será expandido)
    // if (status.focusEnergy) criticalChance *= 2;
    
    return Math.random() < criticalChance;
  }

  /**
   * Calcular multiplicador de crítico
   * @returns {number} - Multiplicador de dano crítico
   */
  static getCriticalMultiplier() {
    // Geralmente 2x, mas pode variar por geração
    return 2.0;
  }

  /**
   * Calcular dano com STAB (Same Type Attack Bonus)
   * @param {Object} skill - Habilidade usada
   * @param {Array} pokemonTypes - Tipos do Pokémon
   * @returns {number} - Multiplicador STAB
   */
  static getSTABMultiplier(skill, pokemonTypes) {
    if (pokemonTypes.includes(skill.type)) {
      return 1.5; // 50% de bônus
    }
    return 1.0;
  }

  /**
   * Simular turno completo entre dois Pokémons
   * @param {Object} pokemon1 - Primeiro Pokémon
   * @param {Object} pokemon2 - Segundo Pokémon
   * @param {Object} skill1 - Habilidade do primeiro
   * @param {Object} skill2 - Habilidade do segundo
   * @param {Object} status - Status effects
   * @returns {Object} - Resultado da simulação
   */
  static simulateTurn(pokemon1, pokemon2, skill1, skill2, status = {}) {
    const turnOrder = this.calculateTurnOrder(pokemon1, pokemon2);
    const results = [];
    
    for (const attackerId of turnOrder) {
      const attacker = attackerId === pokemon1.id ? pokemon1 : pokemon2;
      const defender = attackerId === pokemon1.id ? pokemon2 : pokemon1;
      const skill = attackerId === pokemon1.id ? skill1 : skill2;
      const attackerStatus = status[attackerId] || {};
      
      // Verificar se pode agir
      const canActResult = this.canAct(attacker, attackerStatus);
      if (!canActResult.canAct) {
        results.push({
          attackerId,
          acted: false,
          reason: canActResult.reason
        });
        continue;
      }
      
      // Verificar acerto
      const accuracy = this.calculateAccuracy(skill, attacker, defender, status);
      const hits = Math.random() < accuracy;
      
      if (!hits) {
        results.push({
          attackerId,
          acted: true,
          hits: false,
          reason: 'errou'
        });
        continue;
      }
      
      // Verificar crítico
      const isCritical = this.isCriticalHit(attacker, skill);
      const criticalMultiplier = isCritical ? this.getCriticalMultiplier() : 1.0;
      
      // Calcular STAB
      const stabMultiplier = this.getSTABMultiplier(skill, attacker.types);
      
      results.push({
        attackerId,
        acted: true,
        hits: true,
        critical: isCritical,
        criticalMultiplier,
        stabMultiplier
      });
    }
    
    return {
      turnOrder,
      results
    };
  }

  /**
   * Obter estatísticas do calculador
   * @returns {Object} - Estatísticas
   */
  static getStats() {
    return {
      version: '1.0.0',
      features: [
        'speed-based turn order',
        'priority calculation',
        'status effects',
        'accuracy calculation',
        'critical hit calculation',
        'STAB calculation'
      ],
      futureFeatures: [
        'weather effects',
        'terrain effects',
        'ability effects',
        'item effects',
        'advanced stat modifiers'
      ]
    };
  }
}

module.exports = TurnCalculator;
