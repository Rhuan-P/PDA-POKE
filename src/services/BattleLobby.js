/**
 * BattleLobby - Sistema de gestão de salas de batalha
 * DevOps Squad - Webhook Battle System
 * 
 * Responsável por gerenciar salas de batalha multiplayer,
 * calcular ordem de turnos e manter estado das batalhas.
 */

const InviteService = require('./InviteService');
const MockDataService = require('./MockDataService');
const TurnCalculator = require('../domain/services/TurnCalculator');

class BattleLobby {
  // Armazenamento em memória (MVP)
  static lobbies = new Map();

  /**
   * Criar uma sala de batalha a partir de um convite
   * @param {string} inviteCode - Código do convite
   * @param {string} playerId - ID do jogador entrando
   * @param {string} pokemonId - ID do Pokémon selecionado
   * @returns {Promise<Object>} - Sala de batalha criada
   */
  static async createLobby(inviteCode, playerId, pokemonId) {
    // Adicionar jogador ao convite
    const invite = await InviteService.addPlayerToInvite(inviteCode, playerId, pokemonId);
    
    // Obter dados dos Pokémons
    const [hostPokemon, guestPokemon] = await Promise.all([
      MockDataService.getPokemon(invite.hostPlayer.pokemonId),
      MockDataService.getPokemon(invite.guestPlayer.pokemonId)
    ]);

    // Calcular ordem de turnos baseada em velocidade
    const turnOrder = TurnCalculator.calculateTurnOrder(hostPokemon, guestPokemon);
    
    // Criar lobby
    const lobby = {
      id: invite.id,
      inviteCode,
      players: [
        {
          id: invite.hostPlayer.id,
          pokemon: hostPokemon,
          position: turnOrder[0] === invite.hostPlayer.id ? 1 : 2,
          ready: true,
          joinedAt: invite.hostPlayer.joinedAt
        },
        {
          id: invite.guestPlayer.id,
          pokemon: guestPokemon,
          position: turnOrder[0] === invite.guestPlayer.id ? 1 : 2,
          ready: true,
          joinedAt: invite.guestPlayer.joinedAt
        }
      ],
      status: 'ready', // ready, fighting, finished
      turnOrder,
      currentTurn: turnOrder[0],
      turnHistory: [],
      battleLog: [],
      createdAt: new Date(),
      startedAt: null,
      finishedAt: null,
      winner: null,
      settings: {
        maxTurns: 50, // Máximo de turnos por batalha
        timePerTurn: 30000 // 30 segundos por turno
      }
    };

    this.lobbies.set(lobby.id, lobby);
    
    console.log(`⚔️ Sala criada: ${lobby.id} com jogadores ${invite.hostPlayer.id} e ${invite.guestPlayer.id}`);
    console.log(`🏃 Ordem de turnos: ${turnOrder.join(' → ')}`);
    
    return lobby;
  }

  /**
   * Obter uma sala de batalha
   * @param {string} lobbyId - ID da sala
   * @returns {Object|null} - Dados da sala
   */
  static getLobby(lobbyId) {
    return this.lobbies.get(lobbyId) || null;
  }

  /**
   * Obter sala por código de convite
   * @param {string} inviteCode - Código do convite
   * @returns {Object|null} - Dados da sala
   */
  static getLobbyByInviteCode(inviteCode) {
    for (const lobby of this.lobbies.values()) {
      if (lobby.inviteCode === inviteCode) {
        return lobby;
      }
    }
    return null;
  }

  /**
   * Iniciar uma batalha
   * @param {string} lobbyId - ID da sala
   * @returns {Promise<Object>} - Sala atualizada
   */
  static async startBattle(lobbyId) {
    const lobby = this.getLobby(lobbyId);
    
    if (!lobby) {
      throw new Error('Sala não encontrada');
    }
    
    if (lobby.status !== 'ready') {
      throw new Error('Sala não está pronta para iniciar');
    }
    
    if (lobby.players.length !== 2) {
      throw new Error('Sala incompleta');
    }
    
    // Resetar HP dos Pokémons para o início da batalha
    lobby.players.forEach(player => {
      player.pokemon.currentHp = player.pokemon.stats.maxHp;
      player.pokemon.status = null;
    });
    
    lobby.status = 'fighting';
    lobby.startedAt = new Date();
    lobby.currentTurn = lobby.turnOrder[0];
    
    this.addBattleLog(lobby, '⚔️ Batalha iniciada!');
    this.addBattleLog(lobby, `🏃 ${this.getPlayerName(lobby, lobby.currentTurn)} ataca primeiro!`);
    
    console.log(`⚔️ Batalha iniciada na sala ${lobbyId}`);
    
    return lobby;
  }

  /**
   * Executar um turno de batalha
   * @param {string} lobbyId - ID da sala
   * @param {string} attackerId - ID do atacante
   * @param {string} skillId - ID da habilidade usada
   * @returns {Promise<Object>} - Resultado do turno
   */
  static async executeTurn(lobbyId, attackerId, skillId) {
    const lobby = this.getLobby(lobbyId);
    
    if (!lobby) {
      throw new Error('Sala não encontrada');
    }
    
    if (lobby.status !== 'fighting') {
      throw new Error('Batalha não está em andamento');
    }
    
    if (lobby.currentTurn !== attackerId) {
      throw new Error('Não é o turno deste jogador');
    }
    
    // Encontrar jogadores
    const attacker = lobby.players.find(p => p.id === attackerId);
    const defender = lobby.players.find(p => p.id !== attackerId);
    
    if (!attacker || !defender) {
      throw new Error('Jogadores não encontrados');
    }
    
    // Verificar se o atacante pode atacar
    if (attacker.pokemon.currentHp <= 0) {
      throw new Error('Pokémon do atacante está derrotado');
    }
    
    // Encontrar habilidade
    const skill = attacker.pokemon.skills.find(s => s.id === skillId);
    if (!skill) {
      throw new Error('Habilidade não encontrada');
    }
    
    if (skill.currentPp <= 0) {
      throw new Error('Habilidade sem PP');
    }
    
    // Calcular dano
    const damage = MockDataService.calculateDamage(attacker.pokemon, defender.pokemon, skill);
    const typeEffectiveness = MockDataService.getTypeEffectiveness(skill.type, defender.pokemon.types);
    const finalDamage = Math.floor(damage * typeEffectiveness);
    
    // Aplicar dano
    defender.pokemon.currentHp = Math.max(0, defender.pokemon.currentHp - finalDamage);
    skill.currentPp--;
    
    // Registrar turno
    const turnResult = {
      turnNumber: lobby.turnHistory.length + 1,
      attackerId,
      defenderId: defender.id,
      skillId,
      skillName: skill.name,
      damage: finalDamage,
      typeEffectiveness,
      attackerHp: attacker.pokemon.currentHp,
      defenderHp: defender.pokemon.currentHp,
      timestamp: new Date()
    };
    
    lobby.turnHistory.push(turnResult);
    
    // Adicionar ao log
    const effectivenessText = this.getEffectivenessText(typeEffectiveness);
    this.addBattleLog(lobby, 
      `⚔️ ${attacker.pokemon.name} usou ${skill.name}!${effectivenessText} Causou ${finalDamage} de dano.`
    );
    
    // Verificar se batalha terminou
    if (defender.pokemon.currentHp <= 0) {
      return this.endBattle(lobbyId, attackerId);
    }
    
    // Próximo turno
    const nextTurn = this.getNextTurn(lobby, attackerId);
    lobby.currentTurn = nextTurn;
    
    this.addBattleLog(lobby, `🏃 Vez de ${this.getPlayerName(lobby, nextTurn)}!`);
    
    console.log(`💥 Turno executado: ${attackerId} → ${defender.id} (${finalDamage} dano)`);
    
    return {
      success: true,
      turnResult,
      nextTurn,
      battleStatus: lobby.status,
      players: lobby.players
    };
  }

  /**
   * Finalizar uma batalha
   * @param {string} lobbyId - ID da sala
   * @param {string} winnerId - ID do vencedor
   * @returns {Object} - Resultado final
   */
  static endBattle(lobbyId, winnerId) {
    const lobby = this.getLobby(lobbyId);
    
    if (!lobby) {
      throw new Error('Sala não encontrada');
    }
    
    lobby.status = 'finished';
    lobby.finishedAt = new Date();
    lobby.winner = winnerId;
    
    const winner = lobby.players.find(p => p.id === winnerId);
    const loser = lobby.players.find(p => p.id !== winnerId);
    
    this.addBattleLog(lobby, `🏆 ${winner.pokemon.name} venceu a batalha!`);
    this.addBattleLog(lobby, `💀 ${loser.pokemon.name} foi derrotado!`);
    
    console.log(`🏆 Batalha finalizada na sala ${lobbyId}. Vencedor: ${winnerId}`);
    
    return {
      success: true,
      winner,
      loser,
      battleLog: lobby.battleLog,
      turnHistory: lobby.turnHistory,
      duration: lobby.finishedAt - lobby.startedAt
    };
  }

  /**
   * Obter próximo turno
   * @param {Object} lobby - Dados da sala
   * @param {string} currentPlayerId - ID do jogador atual
   * @returns {string} - ID do próximo jogador
   */
  static getNextTurn(lobby, currentPlayerId) {
    const currentIndex = lobby.turnOrder.indexOf(currentPlayerId);
    const nextIndex = (currentIndex + 1) % lobby.turnOrder.length;
    return lobby.turnOrder[nextIndex];
  }

  /**
   * Adicionar entrada ao log da batalha
   * @param {Object} lobby - Dados da sala
   * @param {string} message - Mensagem do log
   */
  static addBattleLog(lobby, message) {
    const timestamp = new Date().toLocaleTimeString();
    lobby.battleLog.push(`[${timestamp}] ${message}`);
    
    // Limitar tamanho do log
    if (lobby.battleLog.length > 100) {
      lobby.battleLog = lobby.battleLog.slice(-50);
    }
  }

  /**
   * Obter nome do jogador
   * @param {Object} lobby - Dados da sala
   * @param {string} playerId - ID do jogador
   * @returns {string} - Nome do jogador
   */
  static getPlayerName(lobby, playerId) {
    const player = lobby.players.find(p => p.id === playerId);
    return player ? player.pokemon.name : 'Jogador Desconhecido';
  }

  /**
   * Obter texto de efetividade
   * @param {number} effectiveness - Multiplicador de efetividade
   * @returns {string} - Texto descritivo
   */
  static getEffectivenessText(effectiveness) {
    if (effectiveness >= 2) return ' É super efetivo!';
    if (effectiveness <= 0.5) return ' Não é muito efetivo...';
    if (effectiveness === 0) return ' Não afeta...';
    return '';
  }

  /**
   * Limpar salas inativas
   * @returns {number} - Quantidade de salas limpas
   */
  static cleanupInactiveLobbies() {
    const now = new Date();
    const inactiveThreshold = 60 * 60 * 1000; // 1 hora
    let cleaned = 0;
    
    for (const [lobbyId, lobby] of this.lobbies) {
      const lastActivity = lobby.finishedAt || lobby.startedAt || lobby.createdAt;
      
      if (now - lastActivity > inactiveThreshold || lobby.status === 'finished') {
        this.lobbies.delete(lobbyId);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Limpadas ${cleaned} salas inativas`);
    }
    
    return cleaned;
  }

  /**
   * Obter estatísticas das salas
   * @returns {Object} - Estatísticas
   */
  static getStats() {
    const stats = {
      total: this.lobbies.size,
      ready: 0,
      fighting: 0,
      finished: 0,
      totalPlayers: 0,
      averageTurns: 0
    };
    
    let totalTurns = 0;
    let finishedBattles = 0;
    
    for (const lobby of this.lobbies.values()) {
      stats[lobby.status]++;
      stats.totalPlayers += lobby.players.length;
      
      if (lobby.status === 'finished') {
        totalTurns += lobby.turnHistory.length;
        finishedBattles++;
      }
    }
    
    if (finishedBattles > 0) {
      stats.averageTurns = Math.floor(totalTurns / finishedBattles);
    }
    
    return stats;
  }

  /**
   * Obter todas as salas ativas
   * @returns {Array} - Lista de salas ativas
   */
  static getActiveLobbies() {
    return Array.from(this.lobbies.values())
      .filter(lobby => lobby.status !== 'finished')
      .map(lobby => ({
        id: lobby.id,
        inviteCode: lobby.inviteCode,
        status: lobby.status,
        players: lobby.players.map(p => ({
          id: p.id,
          pokemonName: p.pokemon.name,
          ready: p.ready
        })),
        createdAt: lobby.createdAt
      }));
  }
}

// Limpeza automática a cada 30 minutos
setInterval(() => {
  BattleLobby.cleanupInactiveLobbies();
}, 30 * 60 * 1000);

module.exports = BattleLobby;
