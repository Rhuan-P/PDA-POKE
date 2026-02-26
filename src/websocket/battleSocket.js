/**
 * BattleSocket - Servidor WebSocket para batalhas em tempo real
 * DevOps Squad - Webhook Battle System
 * 
 * Responsável por gerenciar conexões WebSocket e eventos
 * de batalha multiplayer com sincronização em tempo real.
 */

const { Server } = require('socket.io');
const BattleLobby = require('../services/BattleLobby');
const InviteService = require('../services/InviteService');
const MockDataService = require('../services/MockDataService');

class BattleSocket {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'] // Fallback para polling
    });
    
    this.connectedClients = new Map(); // clientId -> socket info
    this.lobbyConnections = new Map(); // lobbyId -> Set of socketIds
    
    this.setupEventHandlers();
    this.setupCleanupInterval();
    
    console.log('🔌 BattleSocket inicializado');
  }

  /**
   * Configurar handlers de eventos WebSocket
   */
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Cliente conectado: ${socket.id} (${new Date().toISOString()})`);
      
      // Registrar cliente
      this.connectedClients.set(socket.id, {
        socket,
        connectedAt: new Date(),
        playerId: null,
        currentLobby: null
      });
      
      // Event: Entrar em uma batalha
      socket.on('join-battle', async (data) => {
        await this.handleJoinBattle(socket, data);
      });
      
      // Event: Iniciar batalha
      socket.on('start-battle', async (data) => {
        await this.handleStartBattle(socket, data);
      });
      
      // Event: Selecionar habilidade
      socket.on('skill-selected', async (data) => {
        await this.handleSkillSelected(socket, data);
      });
      
      // Event: Executar turno
      socket.on('execute-turn', async (data) => {
        await this.handleExecuteTurn(socket, data);
      });
      
      // Event: Desistir da batalha
      socket.on('forfeit', async (data) => {
        await this.handleForfeit(socket, data);
      });
      
      // Event: Reconectar à batalha
      socket.on('reconnect-battle', async (data) => {
        await this.handleReconnectBattle(socket, data);
      });
      
      // Event: Ping para manter conexão
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });
      
      // Event: Obter status da sala
      socket.on('get-lobby-status', async (data) => {
        await this.handleGetLobbyStatus(socket, data);
      });
      
      // Disconexão
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
      
      // Erro
      socket.on('error', (error) => {
        console.error(`❌ Erro no socket ${socket.id}:`, error);
        socket.emit('error', { message: 'Erro interno do servidor' });
      });
    });
  }

  /**
   * Lidar com entrada em batalha
   */
  async handleJoinBattle(socket, data) {
    try {
      const { inviteCode, playerId } = data;
      
      console.log(`👤 Tentando entrar na batalha: ${inviteCode} por ${playerId}`);
      
      // Verificar se o convite existe
      const invite = await InviteService.getInvite(inviteCode);
      
      // Verificar se o jogador pode entrar
      if (invite.hostPlayer.id !== playerId && !invite.guestPlayer) {
        // É um convidado entrando
        await InviteService.addPlayerToInvite(inviteCode, playerId, '25'); // Pokémon mock
      }
      
      // Criar ou obter lobby
      let lobby = BattleLobby.getLobbyByInviteCode(inviteCode);
      if (!lobby) {
        lobby = await BattleLobby.createLobby(inviteCode, playerId, '25');
      }
      
      // Entrar na sala do socket
      socket.join(lobby.id);
      
      // Atualizar informações do cliente
      const clientInfo = this.connectedClients.get(socket.id);
      clientInfo.playerId = playerId;
      clientInfo.currentLobby = lobby.id;
      
      // Adicionar às conexões da sala
      if (!this.lobbyConnections.has(lobby.id)) {
        this.lobbyConnections.set(lobby.id, new Set());
      }
      this.lobbyConnections.get(lobby.id).add(socket.id);
      
      // Notificar todos na sala
      const lobbyData = this.formatLobbyForClient(lobby);
      this.io.to(lobby.id).emit('player-joined', {
        playerId,
        lobby: lobbyData,
        message: `Jogador ${playerId} entrou na batalha`
      });
      
      // Enviar confirmação para o jogador
      socket.emit('joined-battle', {
        success: true,
        lobby: lobbyData,
        message: 'Entrou na batalha com sucesso'
      });
      
      console.log(`✅ Jogador ${playerId} entrou na batalha ${lobby.id}`);
      
    } catch (error) {
      console.error(`❌ Erro ao entrar na batalha:`, error.message);
      socket.emit('error', { 
        code: 'JOIN_BATTLE_ERROR',
        message: error.message 
      });
    }
  }

  /**
   * Lidar com início de batalha
   */
  async handleStartBattle(socket, data) {
    try {
      const { lobbyId, playerId } = data;
      
      console.log(`⚔️ Iniciando batalha: ${lobbyId} por ${playerId}`);
      
      const lobby = await BattleLobby.startBattle(lobbyId);
      
      // Notificar todos na sala
      const lobbyData = this.formatLobbyForClient(lobby);
      this.io.to(lobbyId).emit('battle-started', {
        lobby: lobbyData,
        message: 'Batalha iniciada!'
      });
      
      console.log(`⚔️ Batalha iniciada na sala ${lobbyId}`);
      
    } catch (error) {
      console.error(`❌ Erro ao iniciar batalha:`, error.message);
      socket.emit('error', { 
        code: 'START_BATTLE_ERROR',
        message: error.message 
      });
    }
  }

  /**
   * Lidar com seleção de habilidade
   */
  async handleSkillSelected(socket, data) {
    try {
      const { lobbyId, playerId, skillId } = data;
      
      console.log(`⚔️ Habilidade selecionada: ${skillId} por ${playerId} na sala ${lobbyId}`);
      
      // Notificar o oponente sobre a seleção
      socket.to(lobbyId).emit('opponent-skill-selected', {
        playerId,
        skillId,
        message: 'Oponente selecionou uma habilidade'
      });
      
      // Confirmar para o jogador
      socket.emit('skill-confirmed', {
        skillId,
        message: 'Habilidade confirmada'
      });
      
    } catch (error) {
      console.error(`❌ Erro ao selecionar habilidade:`, error.message);
      socket.emit('error', { 
        code: 'SKILL_SELECT_ERROR',
        message: error.message 
      });
    }
  }

  /**
   * Lidar com execução de turno
   */
  async handleExecuteTurn(socket, data) {
    try {
      const { lobbyId, playerId, skillId } = data;
      
      console.log(`💥 Executando turno: ${playerId} usou ${skillId} na sala ${lobbyId}`);
      
      const result = await BattleLobby.executeTurn(lobbyId, playerId, skillId);
      
      // Formatar resultado para clientes
      const turnData = {
        turnResult: result.turnResult,
        nextTurn: result.nextTurn,
        battleStatus: result.battleStatus,
        players: result.players.map(player => ({
          id: player.id,
          pokemon: {
            id: player.pokemon.id,
            name: player.pokemon.name,
            currentHp: player.pokemon.currentHp,
            maxHp: player.pokemon.stats.maxHp,
            sprite: player.pokemon.sprite
          }
        })),
        battleLog: result.battleLog || []
      };
      
      // Notificar todos na sala
      if (result.battleStatus === 'finished') {
        // Batalha terminou
        this.io.to(lobbyId).emit('battle-finished', {
          winner: result.winner,
          loser: result.loser,
          finalLog: result.battleLog,
          turnHistory: result.turnHistory,
          message: 'Batalha finalizada!'
        });
        
        // Limpar conexões da sala
        this.lobbyConnections.delete(lobbyId);
      } else {
        // Turno normal
        this.io.to(lobbyId).emit('turn-executed', {
          ...turnData,
          message: 'Turno executado'
        });
      }
      
      console.log(`💥 Turno executado: ${playerId} → ${result.turnResult.defenderId} (${result.turnResult.damage} dano)`);
      
    } catch (error) {
      console.error(`❌ Erro ao executar turno:`, error.message);
      socket.emit('error', { 
        code: 'EXECUTE_TURN_ERROR',
        message: error.message 
      });
    }
  }

  /**
   * Lidar com desistência
   */
  async handleForfeit(socket, data) {
    try {
      const { lobbyId, playerId } = data;
      
      console.log(`🏳️ Jogador ${playerId} desistiu da batalha ${lobbyId}`);
      
      const lobby = BattleLobby.getLobby(lobbyId);
      if (!lobby) {
        throw new Error('Sala não encontrada');
      }
      
      // Determinar vencedor (o outro jogador)
      const winner = lobby.players.find(p => p.id !== playerId);
      const loser = lobby.players.find(p => p.id === playerId);
      
      // Finalizar batalha
      const result = BattleLobby.endBattle(lobbyId, winner.id);
      
      // Notificar todos
      this.io.to(lobbyId).emit('battle-finished', {
        winner: winner,
        loser: loser,
        forfeited: true,
        message: `${loser.pokemon.name} desistiu! ${winner.pokemon.name} venceu!`
      });
      
      // Limpar conexões
      this.lobbyConnections.delete(lobbyId);
      
      console.log(`🏳️ Batalha finalizada por desistência: ${lobbyId}`);
      
    } catch (error) {
      console.error(`❌ Erro ao desistir:`, error.message);
      socket.emit('error', { 
        code: 'FORFEIT_ERROR',
        message: error.message 
      });
    }
  }

  /**
   * Lidar com reconexão à batalha
   */
  async handleReconnectBattle(socket, data) {
    try {
      const { lobbyId, playerId } = data;
      
      console.log(`🔄 Reconectando à batalha: ${lobbyId} por ${playerId}`);
      
      const lobby = BattleLobby.getLobby(lobbyId);
      if (!lobby) {
        throw new Error('Sala não encontrada');
      }
      
      // Re-entrar na sala
      socket.join(lobbyId);
      
      // Atualizar informações do cliente
      const clientInfo = this.connectedClients.get(socket.id);
      clientInfo.playerId = playerId;
      clientInfo.currentLobby = lobbyId;
      
      // Adicionar às conexões da sala
      if (!this.lobbyConnections.has(lobbyId)) {
        this.lobbyConnections.set(lobbyId, new Set());
      }
      this.lobbyConnections.get(lobbyId).add(socket.id);
      
      // Enviar estado atual
      const lobbyData = this.formatLobbyForClient(lobby);
      socket.emit('battle-reconnected', {
        success: true,
        lobby: lobbyData,
        message: 'Reconectado à batalha'
      });
      
      console.log(`✅ Jogador ${playerId} reconectado à batalha ${lobbyId}`);
      
    } catch (error) {
      console.error(`❌ Erro ao reconectar:`, error.message);
      socket.emit('error', { 
        code: 'RECONNECT_ERROR',
        message: error.message 
      });
    }
  }

  /**
   * Lidar com obtenção de status da sala
   */
  async handleGetLobbyStatus(socket, data) {
    try {
      const { lobbyId } = data;
      
      const lobby = BattleLobby.getLobby(lobbyId);
      if (!lobby) {
        throw new Error('Sala não encontrada');
      }
      
      const lobbyData = this.formatLobbyForClient(lobby);
      socket.emit('lobby-status', {
        lobby: lobbyData
      });
      
    } catch (error) {
      console.error(`❌ Erro ao obter status:`, error.message);
      socket.emit('error', { 
        code: 'STATUS_ERROR',
        message: error.message 
      });
    }
  }

  /**
   * Lidar com disconexão
   */
  handleDisconnect(socket) {
    const clientInfo = this.connectedClients.get(socket.id);
    
    if (clientInfo) {
      console.log(`🔌 Cliente desconectado: ${socket.id} (jogador: ${clientInfo.playerId || 'desconhecido'})`);
      
      // Remover das conexões da sala
      if (clientInfo.currentLobby) {
        const lobbyConnections = this.lobbyConnections.get(clientInfo.currentLobby);
        if (lobbyConnections) {
          lobbyConnections.delete(socket.id);
          
          // Notificar outros jogadores
          socket.to(clientInfo.currentLobby).emit('player-disconnected', {
            playerId: clientInfo.playerId,
            message: 'Jogador desconectado'
          });
        }
      }
      
      // Remover cliente conectado
      this.connectedClients.delete(socket.id);
    }
  }

  /**
   * Formatar dados da sala para o cliente
   */
  formatLobbyForClient(lobby) {
    return {
      id: lobby.id,
      inviteCode: lobby.inviteCode,
      status: lobby.status,
      currentTurn: lobby.currentTurn,
      turnOrder: lobby.turnOrder,
      players: lobby.players.map(player => ({
        id: player.id,
        pokemon: {
          id: player.pokemon.id,
          name: player.pokemon.name,
          sprite: player.pokemon.sprite,
          currentHp: player.pokemon.currentHp,
          maxHp: player.pokemon.stats.maxHp,
          types: player.pokemon.types,
          skills: player.pokemon.skills
        },
        position: player.position,
        ready: player.ready
      })),
      battleLog: lobby.battleLog,
      turnHistory: lobby.turnHistory,
      createdAt: lobby.createdAt,
      startedAt: lobby.startedAt,
      finishedAt: lobby.finishedAt,
      winner: lobby.winner
    };
  }

  /**
   * Configurar limpeza periódica
   */
  setupCleanupInterval() {
    // Limpar conexões inativas a cada 5 minutos
    setInterval(() => {
      const now = new Date();
      const inactiveThreshold = 10 * 60 * 1000; // 10 minutos
      
      for (const [socketId, clientInfo] of this.connectedClients) {
        if (now - clientInfo.connectedAt > inactiveThreshold) {
          const socket = clientInfo.socket;
          if (socket.connected) {
            socket.disconnect(true);
          }
          this.connectedClients.delete(socketId);
        }
      }
      
      console.log(`🧹 Conexões ativas: ${this.connectedClients.size}`);
    }, 5 * 60 * 1000);
  }

  /**
   * Obter estatísticas do WebSocket
   */
  getStats() {
    return {
      connectedClients: this.connectedClients.size,
      activeLobbies: this.lobbyConnections.size,
      totalConnections: this.connectedClients.size,
      uptime: process.uptime()
    };
  }

  /**
   * Broadcast para todas as conexões
   */
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  /**
   * Broadcast para uma sala específica
   */
  broadcastToLobby(lobbyId, event, data) {
    this.io.to(lobbyId).emit(event, data);
  }

  /**
   * Enviar para um cliente específico
   */
  sendToClient(socketId, event, data) {
    const clientInfo = this.connectedClients.get(socketId);
    if (clientInfo) {
      clientInfo.socket.emit(event, data);
    }
  }
}

module.exports = BattleSocket;
