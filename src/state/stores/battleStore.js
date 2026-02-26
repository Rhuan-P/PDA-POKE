/**
 * Battle Store - Estado reativo para batalhas multiplayer
 * DevOps Squad - Webhook Battle System
 * 
 * Responsável por gerenciar o estado das batalhas multiplayer
 * com WebSocket e sincronização em tempo real.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Importar io-client para WebSocket
let io;
try {
  io = require('socket.io-client');
} catch (error) {
  console.warn('⚠️ Socket.IO client não disponível, usando fallback');
}

export const useBattleStore = defineStore('battle', () => {
  // Estado principal
  const socket = ref(null);
  const connected = ref(false);
  const connecting = ref(false);
  
  // Estado do convite
  const inviteCode = ref('');
  const inviteLink = ref('');
  const inviteExpiresAt = ref(null);
  const inviteStatus = ref('none'); // none, creating, created, expired, cancelled
  
  // Estado da sala (lobby)
  const currentLobby = ref(null);
  const lobbyStatus = ref('none'); // none, joining, joined, ready, fighting, finished
  const players = ref([]);
  const turnOrder = ref([]);
  const currentTurn = ref(null);
  
  // Estado da batalha
  const battleStatus = ref('waiting'); // waiting, ready, fighting, finished
  const battleLog = ref([]);
  const turnHistory = ref([]);
  const winner = ref(null);
  const loser = ref(null);
  
  // Estado da UI
  const showInviteModal = ref(false);
  const selectedSkill = ref(null);
  const isPlayerTurn = ref(false);
  const battleAnimation = ref(null);
  
  // Estado de erro
  const error = ref('');
  const loading = ref(false);
  
  // Configuração
  const config = ref({
    wsUrl: process.env.VUE_APP_WS_URL || 'http://localhost:3001',
    apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
    reconnectAttempts: 5,
    reconnectDelay: 2000
  });

  // Computed properties
  const isHost = computed(() => {
    return players.value.length > 0 && players.value[0].id === 'player1'; // Mock
  });
  
  const playerCount = computed(() => players.value.length);
  const canStartBattle = computed(() => {
    return playerCount.value === 2 && players.value.every(p => p.ready);
  });
  
  const currentPlayer = computed(() => {
    return players.value.find(p => p.id === 'player1'); // Mock - virá do auth
  });
  
  const opponent = computed(() => {
    return players.value.find(p => p.id !== 'player1'); // Mock - virá do auth
  });
  
  const timeRemaining = computed(() => {
    if (!inviteExpiresAt.value) return null;
    const now = new Date();
    const expires = new Date(inviteExpiresAt.value);
    return Math.max(0, expires.getTime() - now.getTime());
  });

  // WebSocket connection
  const connectSocket = () => {
    if (socket.value?.connected) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      try {
        connecting.value = true;
        
        socket.value = io(config.value.wsUrl, {
          transports: ['websocket', 'polling'],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: config.value.reconnectAttempts,
          reconnectionDelay: config.value.reconnectDelay
        });
        
        // Connection events
        socket.value.on('connect', () => {
          console.log('🔌 Conectado ao WebSocket');
          connected.value = true;
          connecting.value = false;
          error.value = '';
          resolve();
        });
        
        socket.value.on('disconnect', (reason) => {
          console.log('🔌 Desconectado do WebSocket:', reason);
          connected.value = false;
          
          if (reason === 'io server disconnect') {
            // Server disconnected, reconnect manually
            connectSocket();
          }
        });
        
        socket.value.on('connect_error', (err) => {
          console.error('❌ Erro na conexão WebSocket:', err);
          connected.value = false;
          connecting.value = false;
          error.value = 'Falha na conexão com o servidor';
          reject(err);
        });
        
        // Battle events
        socket.value.on('joined-battle', (data) => {
          console.log('✅ Entrou na batalha:', data);
          handleJoinedBattle(data);
        });
        
        socket.value.on('player-joined', (data) => {
          console.log('👤 Jogador entrou:', data);
          handlePlayerJoined(data);
        });
        
        socket.value.on('battle-started', (data) => {
          console.log('⚔️ Batalha iniciada:', data);
          handleBattleStarted(data);
        });
        
        socket.value.on('opponent-skill-selected', (data) => {
          console.log('⚔️ Oponente selecionou habilidade:', data);
          handleOpponentSkillSelected(data);
        });
        
        socket.value.on('turn-executed', (data) => {
          console.log('💥 Turno executado:', data);
          handleTurnExecuted(data);
        });
        
        socket.value.on('battle-finished', (data) => {
          console.log('🏆 Batalha finalizada:', data);
          handleBattleFinished(data);
        });
        
        socket.value.on('player-disconnected', (data) => {
          console.log('🔌 Jogador desconectado:', data);
          handlePlayerDisconnected(data);
        });
        
        socket.value.on('error', (data) => {
          console.error('❌ Erro no WebSocket:', data);
          error.value = data.message || 'Erro desconhecido';
        });
        
        socket.value.on('pong', (data) => {
          // Ping/pong para manter conexão
          console.log('🏓 Pong recebido:', data.timestamp);
        });
        
      } catch (err) {
        console.error('❌ Erro ao criar conexão WebSocket:', err);
        connecting.value = false;
        reject(err);
      }
    });
  };

  // API methods
  const createInvite = async (playerId, pokemonId) => {
    try {
      loading.value = true;
      error.value = '';
      inviteStatus.value = 'creating';
      
      const response = await fetch(`${config.value.apiUrl}/battle/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId, pokemonId })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao criar convite');
      }
      
      inviteCode.value = data.data.inviteCode;
      inviteLink.value = data.data.inviteLink;
      inviteExpiresAt.value = data.data.expiresAt;
      inviteStatus.value = 'created';
      players.value = [data.data.hostPlayer];
      
      // Conectar WebSocket após criar convite
      await connectSocket();
      
      console.log('🎮 Convite criado:', inviteCode.value);
      return data;
      
    } catch (err) {
      console.error('❌ Erro ao criar convite:', err);
      error.value = err.message;
      inviteStatus.value = 'none';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const joinBattle = async (inviteCodeParam, playerId, pokemonId) => {
    try {
      loading.value = true;
      error.value = '';
      lobbyStatus.value = 'joining';
      
      // Conectar WebSocket primeiro
      await connectSocket();
      
      const response = await fetch(`${config.value.apiUrl}/battle/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          inviteCode: inviteCodeParam, 
          playerId, 
          pokemonId 
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao entrar na batalha');
      }
      
      // Entrar na sala via WebSocket
      socket.value.emit('join-battle', {
        inviteCode: inviteCodeParam,
        playerId
      });
      
      console.log('👤 Entrando na batalha:', inviteCodeParam);
      return data;
      
    } catch (err) {
      console.error('❌ Erro ao entrar na batalha:', err);
      error.value = err.message;
      lobbyStatus.value = 'none';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const startBattle = async () => {
    try {
      loading.value = true;
      error.value = '';
      
      if (!currentLobby.value) {
        throw new Error('Nenhuma sala ativa');
      }
      
      socket.value.emit('start-battle', {
        lobbyId: currentLobby.value.id,
        playerId: 'player1' // Mock - virá do auth
      });
      
      console.log('⚔️ Iniciando batalha');
      
    } catch (err) {
      console.error('❌ Erro ao iniciar batalha:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const selectSkill = (skillId) => {
    try {
      if (!socket.value?.connected || !currentLobby.value) {
        throw new Error('Não conectado à batalha');
      }
      
      selectedSkill.value = skillId;
      
      socket.value.emit('skill-selected', {
        lobbyId: currentLobby.value.id,
        playerId: 'player1', // Mock - virá do auth
        skillId
      });
      
      console.log('⚔️ Habilidade selecionada:', skillId);
      
    } catch (err) {
      console.error('❌ Erro ao selecionar habilidade:', err);
      error.value = err.message;
    }
  };

  const executeTurn = async (skillId) => {
    try {
      loading.value = true;
      error.value = '';
      
      if (!socket.value?.connected || !currentLobby.value) {
        throw new Error('Não conectado à batalha');
      }
      
      socket.value.emit('execute-turn', {
        lobbyId: currentLobby.value.id,
        playerId: 'player1', // Mock - virá do auth
        skillId
      });
      
      console.log('💥 Executando turno:', skillId);
      
    } catch (err) {
      console.error('❌ Erro ao executar turno:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const forfeit = async () => {
    try {
      loading.value = true;
      error.value = '';
      
      if (!socket.value?.connected || !currentLobby.value) {
        throw new Error('Não conectado à batalha');
      }
      
      socket.value.emit('forfeit', {
        lobbyId: currentLobby.value.id,
        playerId: 'player1' // Mock - virá do auth
      });
      
      console.log('🏳️ Desistindo da batalha');
      
    } catch (err) {
      console.error('❌ Erro ao desistir:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Event handlers
  const handleJoinedBattle = (data) => {
    if (data.success) {
      currentLobby.value = data.lobby;
      players.value = data.lobby.players;
      turnOrder.value = data.lobby.turnOrder;
      lobbyStatus.value = 'joined';
      battleStatus.value = data.lobby.status;
      battleLog.value = data.lobby.battleLog || [];
      
      addLogEntry('✅ Entrou na batalha com sucesso');
    } else {
      error.value = data.message || 'Erro ao entrar na batalha';
    }
  };

  const handlePlayerJoined = (data) => {
    players.value = data.lobby.players;
    turnOrder.value = data.lobby.turnOrder;
    currentLobby.value = data.lobby;
    
    addLogEntry(`👤 ${data.message}`);
  };

  const handleBattleStarted = (data) => {
    battleStatus.value = 'fighting';
    currentTurn.value = data.lobby.currentTurn;
    players.value = data.lobby.players;
    currentLobby.value = data.lobby;
    
    addLogEntry('⚔️ Batalha iniciada!');
    checkPlayerTurn();
  };

  const handleOpponentSkillSelected = (data) => {
    addLogEntry(`⚔️ Oponente selecionou uma habilidade`);
    battleAnimation.value = 'opponent-selecting';
  };

  const handleTurnExecuted = (data) => {
    turnHistory.value.push(data.turnResult);
    currentTurn.value = data.nextTurn;
    players.value = data.players;
    battleLog.value = data.battleLog;
    
    addLogEntry(`💥 Turno executado: ${data.turnResult.damage} de dano`);
    
    battleAnimation.value = 'damage';
    setTimeout(() => {
      battleAnimation.value = null;
    }, 1000);
    
    checkPlayerTurn();
  };

  const handleBattleFinished = (data) => {
    battleStatus.value = 'finished';
    winner.value = data.winner;
    loser.value = data.loser;
    battleLog.value = data.finalLog || battleLog.value;
    turnHistory.value = data.turnHistory || turnHistory.value;
    
    addLogEntry(`🏆 Batalha finalizada! ${data.winner.pokemon.name} venceu!`);
    
    // Limpar conexão após um tempo
    setTimeout(() => {
      disconnect();
    }, 5000);
  };

  const handlePlayerDisconnected = (data) => {
    addLogEntry(`🔌 ${data.message}`);
  };

  // Utility methods
  const addLogEntry = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    battleLog.value.push(`[${timestamp}] ${message}`);
    
    // Limitar tamanho do log
    if (battleLog.value.length > 100) {
      battleLog.value = battleLog.value.slice(-50);
    }
  };

  const checkPlayerTurn = () => {
    isPlayerTurn.value = currentTurn.value === 'player1'; // Mock - virá do auth
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
    
    connected.value = false;
    connecting.value = false;
    
    // Resetar estado
    currentLobby.value = null;
    players.value = [];
    turnOrder.value = [];
    currentTurn.value = null;
    battleStatus.value = 'waiting';
    isPlayerTurn.value = false;
    selectedSkill.value = null;
  };

  const reset = () => {
    disconnect();
    
    // Resetar convite
    inviteCode.value = '';
    inviteLink.value = '';
    inviteExpiresAt.value = null;
    inviteStatus.value = 'none';
    
    // Resetar batalha
    battleLog.value = [];
    turnHistory.value = [];
    winner.value = null;
    loser.value = null;
    
    // Resetar UI
    showInviteModal.value = false;
    error.value = '';
    loading.value = false;
  };

  const refreshStatus = async () => {
    if (!currentLobby.value) return;
    
    try {
      const response = await fetch(`${config.value.apiUrl}/battle/lobby/${currentLobby.value.id}`);
      const data = await response.json();
      
      if (data.success) {
        currentLobby.value = data.data;
        players.value = data.data.players;
        battleStatus.value = data.data.status;
        battleLog.value = data.data.battleLog;
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar status:', err);
    }
  };

  // Ping para manter conexão
  const ping = () => {
    if (socket.value?.connected) {
      socket.value.emit('ping');
    }
  };

  // Auto-ping a cada 30 segundos
  let pingInterval = null;
  
  const startPingInterval = () => {
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(ping, 30000);
  };
  
  const stopPingInterval = () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  };

  // Watch para conexão
  watch(connected, (newValue) => {
    if (newValue) {
      startPingInterval();
    } else {
      stopPingInterval();
    }
  });

  return {
    // Estado
    socket,
    connected,
    connecting,
    inviteCode,
    inviteLink,
    inviteExpiresAt,
    inviteStatus,
    currentLobby,
    lobbyStatus,
    players,
    turnOrder,
    currentTurn,
    battleStatus,
    battleLog,
    turnHistory,
    winner,
    loser,
    showInviteModal,
    selectedSkill,
    isPlayerTurn,
    battleAnimation,
    error,
    loading,
    
    // Computed
    isHost,
    playerCount,
    canStartBattle,
    currentPlayer,
    opponent,
    timeRemaining,
    
    // Methods
    connectSocket,
    createInvite,
    joinBattle,
    startBattle,
    selectSkill,
    executeTurn,
    forfeit,
    disconnect,
    reset,
    refreshStatus,
    ping,
    
    // UI methods
    openInviteModal: () => { showInviteModal.value = true; },
    closeInviteModal: () => { showInviteModal.value = false; },
    
    // Config
    config
  };
});
