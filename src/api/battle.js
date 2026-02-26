/**
 * Battle API - Endpoints para sistema de batalha multiplayer
 * DevOps Squad - Webhook Battle System
 * 
 * Responsável por fornecer endpoints RESTful para
 * criação de convites, entrada em batalhas e gestão de salas.
 */

const express = require('express');
const router = express.Router();
const InviteService = require('../services/InviteService');
const BattleLobby = require('../services/BattleLobby');
const MockDataService = require('../services/MockDataService');

/**
 * Middleware para logging de requisições
 */
router.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

/**
 * Middleware para validação de entrada
 */
const validateInput = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Campos obrigatórios faltando: ${missing.join(', ')}`
      });
    }
    
    next();
  };
};

/**
 * POST /api/battle/invite
 * Criar um novo convite de batalha
 */
router.post('/invite', validateInput(['playerId', 'pokemonId']), async (req, res) => {
  try {
    const { playerId, pokemonId } = req.body;
    
    // Validar se o Pokémon existe
    const pokemon = await MockDataService.getPokemon(pokemonId);
    
    // Criar convite
    const inviteCode = await InviteService.createInvite(playerId, pokemonId);
    
    // Gerar link de convite
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/battle/invite/${inviteCode}`;
    
    // Obter dados do convite
    const invite = await InviteService.getInvite(inviteCode);
    
    res.status(201).json({
      success: true,
      data: {
        inviteCode,
        inviteLink,
        hostPlayer: {
          id: playerId,
          pokemonId,
          pokemonName: pokemon.name,
          pokemonSprite: pokemon.sprite
        },
        expiresAt: invite.expiresAt,
        maxPlayers: invite.maxPlayers
      },
      message: 'Convite criado com sucesso'
    });
    
    console.log(`🎮 Convite criado: ${inviteCode} por ${playerId}`);
    
  } catch (error) {
    console.error('❌ Erro ao criar convite:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro ao criar convite'
    });
  }
});

/**
 * POST /api/battle/join
 * Entrar em uma batalha através de convite
 */
router.post('/join', validateInput(['inviteCode', 'playerId', 'pokemonId']), async (req, res) => {
  try {
    const { inviteCode, playerId, pokemonId } = req.body;
    
    // Validar se o Pokémon existe
    const pokemon = await MockDataService.getPokemon(pokemonId);
    
    // Verificar se o convite existe e está válido
    const invite = await InviteService.getInvite(inviteCode);
    
    // Adicionar jogador ao convite
    await InviteService.addPlayerToInvite(inviteCode, playerId, pokemonId);
    
    // Criar sala de batalha
    const lobby = await BattleLobby.createLobby(inviteCode, playerId, pokemonId);
    
    res.status(200).json({
      success: true,
      data: {
        lobbyId: lobby.id,
        inviteCode,
        players: lobby.players.map(player => ({
          id: player.id,
          pokemonId: player.pokemon.id,
          pokemonName: player.pokemon.name,
          pokemonSprite: player.pokemon.sprite,
          position: player.position,
          ready: player.ready
        })),
        turnOrder: lobby.turnOrder,
        status: lobby.status,
        createdAt: lobby.createdAt
      },
      message: 'Entrou na batalha com sucesso'
    });
    
    console.log(`👤 Jogador ${playerId} entrou na batalha ${inviteCode}`);
    
  } catch (error) {
    console.error('❌ Erro ao entrar na batalha:', error.message);
    
    const statusCode = error.message.includes('não encontrado') ? 404 : 
                      error.message.includes('cheia') ? 409 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Erro ao entrar na batalha'
    });
  }
});

/**
 * GET /api/battle/invite/:inviteCode
 * Obter informações de um convite
 */
router.get('/invite/:inviteCode', async (req, res) => {
  try {
    const { inviteCode } = req.params;
    
    const invite = await InviteService.getInvite(inviteCode);
    
    // Obter dados dos Pokémons se disponíveis
    const players = [];
    
    if (invite.hostPlayer) {
      const hostPokemon = await MockDataService.getPokemon(invite.hostPlayer.pokemonId);
      players.push({
        id: invite.hostPlayer.id,
        pokemonId: invite.hostPlayer.pokemonId,
        pokemonName: hostPokemon.name,
        pokemonSprite: hostPokemon.sprite,
        isHost: true,
        joinedAt: invite.hostPlayer.joinedAt
      });
    }
    
    if (invite.guestPlayer) {
      const guestPokemon = await MockDataService.getPokemon(invite.guestPlayer.pokemonId);
      players.push({
        id: invite.guestPlayer.id,
        pokemonId: invite.guestPlayer.pokemonId,
        pokemonName: guestPokemon.name,
        pokemonSprite: guestPokemon.sprite,
        isHost: false,
        joinedAt: invite.guestPlayer.joinedAt
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        inviteCode,
        status: invite.status,
        players,
        maxPlayers: invite.maxPlayers,
        createdAt: invite.createdAt,
        expiresAt: invite.expiresAt
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter convite:', error.message);
    
    const statusCode = error.message.includes('não encontrado') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Erro ao obter convite'
    });
  }
});

/**
 * POST /api/battle/start
 * Iniciar uma batalha
 */
router.post('/start', validateInput(['lobbyId']), async (req, res) => {
  try {
    const { lobbyId } = req.body;
    
    const lobby = await BattleLobby.startBattle(lobbyId);
    
    res.status(200).json({
      success: true,
      data: {
        lobbyId: lobby.id,
        status: lobby.status,
        currentTurn: lobby.currentTurn,
        players: lobby.players.map(player => ({
          id: player.id,
          pokemon: {
            id: player.pokemon.id,
            name: player.pokemon.name,
            sprite: player.pokemon.sprite,
            currentHp: player.pokemon.currentHp,
            maxHp: player.pokemon.stats.maxHp,
            types: player.pokemon.types
          },
          position: player.position
        })),
        startedAt: lobby.startedAt,
        battleLog: lobby.battleLog
      },
      message: 'Batalha iniciada com sucesso'
    });
    
    console.log(`⚔️ Batalha iniciada: ${lobbyId}`);
    
  } catch (error) {
    console.error('❌ Erro ao iniciar batalha:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro ao iniciar batalha'
    });
  }
});

/**
 * POST /api/battle/turn
 * Executar um turno de batalha
 */
router.post('/turn', validateInput(['lobbyId', 'playerId', 'skillId']), async (req, res) => {
  try {
    const { lobbyId, playerId, skillId } = req.body;
    
    const result = await BattleLobby.executeTurn(lobbyId, playerId, skillId);
    
    res.status(200).json({
      success: true,
      data: {
        turnResult: result.turnResult,
        nextTurn: result.nextTurn,
        battleStatus: result.battleStatus,
        players: result.players,
        battleLog: result.battleLog || []
      },
      message: 'Turno executado com sucesso'
    });
    
    console.log(`💥 Turno executado: ${playerId} usou ${skillId} na sala ${lobbyId}`);
    
  } catch (error) {
    console.error('❌ Erro ao executar turno:', error.message);
    
    const statusCode = error.message.includes('não é o turno') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Erro ao executar turno'
    });
  }
});

/**
 * GET /api/battle/lobby/:lobbyId
 * Obter informações de uma sala de batalha
 */
router.get('/lobby/:lobbyId', async (req, res) => {
  try {
    const { lobbyId } = req.params;
    
    const lobby = BattleLobby.getLobby(lobbyId);
    
    if (!lobby) {
      return res.status(404).json({
        success: false,
        error: 'Sala não encontrada',
        message: 'Sala de batalha não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        lobbyId: lobby.id,
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
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter sala:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro ao obter sala'
    });
  }
});

/**
 * GET /api/battle/lobbies
 * Listar salas de batalha ativas
 */
router.get('/lobbies', async (req, res) => {
  try {
    const lobbies = BattleLobby.getActiveLobbies();
    
    res.status(200).json({
      success: true,
      data: {
        lobbies,
        total: lobbies.length
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar salas:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro ao listar salas'
    });
  }
});

/**
 * GET /api/battle/pokemon
 * Listar Pokémons disponíveis
 */
router.get('/pokemon', async (req, res) => {
  try {
    const pokemon = MockDataService.getAllPokemon();
    
    res.status(200).json({
      success: true,
      data: {
        pokemon,
        total: pokemon.length
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar Pokémons:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro ao listar Pokémons'
    });
  }
});

/**
 * GET /api/battle/pokemon/:pokemonId
 * Obter detalhes de um Pokémon
 */
router.get('/pokemon/:pokemonId', async (req, res) => {
  try {
    const { pokemonId } = req.params;
    
    const pokemon = await MockDataService.getPokemon(pokemonId);
    
    res.status(200).json({
      success: true,
      data: pokemon
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter Pokémon:', error.message);
    
    res.status(404).json({
      success: false,
      error: error.message,
      message: 'Pokémon não encontrado'
    });
  }
});

/**
 * GET /api/battle/skills
 * Listar habilidades disponíveis
 */
router.get('/skills', async (req, res) => {
  try {
    const skills = MockDataService.getAllSkills();
    
    res.status(200).json({
      success: true,
      data: {
        skills,
        total: skills.length
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar habilidades:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro ao listar habilidades'
    });
  }
});

/**
 * GET /api/battle/stats
 * Obter estatísticas do sistema
 */
router.get('/stats', async (req, res) => {
  try {
    const inviteStats = InviteService.getStats();
    const lobbyStats = BattleLobby.getStats();
    const mockStats = MockDataService.getStats();
    
    res.status(200).json({
      success: true,
      data: {
        invites: inviteStats,
        lobbies: lobbyStats,
        mockData: mockStats,
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro ao obter estatísticas'
    });
  }
});

/**
 * DELETE /api/battle/invite/:inviteCode
 * Cancelar um convite (apenas host)
 */
router.delete('/invite/:inviteCode', validateInput(['playerId']), async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { playerId } = req.body;
    
    const invite = await InviteService.cancelInvite(inviteCode, playerId);
    
    res.status(200).json({
      success: true,
      data: {
        inviteCode,
        status: invite.status
      },
      message: 'Convite cancelado com sucesso'
    });
    
    console.log(`❌ Convite ${inviteCode} cancelado por ${playerId}`);
    
  } catch (error) {
    console.error('❌ Erro ao cancelar convite:', error.message);
    
    const statusCode = error.message.includes('Apenas o host') ? 403 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Erro ao cancelar convite'
    });
  }
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Battle API is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
