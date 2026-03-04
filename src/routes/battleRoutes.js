/**
 * Rotas da API para Batalhas
 * Aproveitando battleController existente
 */

import express from 'express';
import { battleController } from '../application/controllers/battleController.js';

const router = express.Router();

// Armazenamento temporário de batalhas (em produção usar Redis/DB)
const battles = new Map();

// Middleware para validar battleId
const validateBattle = (req, res, next) => {
  const { battleId } = req.params;
  if (!battles.has(battleId)) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Battle not found',
        code: 'BATTLE_NOT_FOUND'
      }
    });
  }
  req.battle = battles.get(battleId);
  next();
};

// POST /api/battle/create - Criar nova batalha
router.post('/create', (req, res) => {
  try {
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const battle = {
      id: battleId,
      status: 'waiting',
      players: {
        1: { pokemon: null, ready: false },
        2: { pokemon: null, ready: false }
      },
      currentTurn: null,
      winner: null,
      createdAt: new Date().toISOString()
    };

    battles.set(battleId, battle);

    res.json({
      success: true,
      data: {
        battleId,
        status: battle.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'BATTLE_CREATE_ERROR'
      }
    });
  }
});

// POST /api/battle/:battleId/select - Selecionar Pokémon
router.post('/:battleId/select', validateBattle, async (req, res) => {
  try {
    const { battleId } = req.params;
    const { playerId, pokemonName } = req.body;
    const battle = battles.get(battleId);

    // Debug log
    console.log('Select Pokemon - playerId:', playerId, 'type:', typeof playerId, 'pokemonName:', pokemonName);

    // Validar playerId
    if (!['1', '2'].includes(String(playerId))) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid player ID',
          code: 'INVALID_PLAYER_ID'
        }
      });
    }

    // Usar battleController existente
    await battleController.selectPokemon(parseInt(playerId), pokemonName);

    // Atualizar estado da batalha
    battle.players[playerId] = {
      pokemon: pokemonName,
      ready: true
    };

    // Verificar se ambos jogadores estão prontos
    if (battle.players[1].ready && battle.players[2].ready) {
      battle.status = 'ready';
    }

    res.json({
      success: true,
      data: {
        battleId,
        playerId,
        pokemon: pokemonName,
        battleStatus: battle.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'POKEMON_SELECT_ERROR'
      }
    });
  }
});

// POST /api/battle/:battleId/start - Iniciar batalha
router.post('/:battleId/start', validateBattle, (req, res) => {
  try {
    const { battleId } = req.params;
    const battle = battles.get(battleId);

    if (battle.status !== 'ready') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Battle not ready to start',
          code: 'BATTLE_NOT_READY'
        }
      });
    }

    // Usar battleController existente
    const startResult = battleController.startBattle();

    battle.status = 'active';
    battle.currentTurn = startResult.currentTurn;

    // Adicionar dados completos dos Pokémon ao battle
    battle.player1Data = battleController.player1Pokemon;
    battle.player2Data = battleController.player2Pokemon;

    console.log(`🔍 DEBUG: Battle iniciado com dados completos:`, {
      player1: battle.player1Data.name,
      player2: battle.player2Data.name,
      player1Hp: battle.player1Data.currentHp,
      player2Hp: battle.player2Data.currentHp
    });

    res.json({
      success: true,
      data: {
        battleId,
        status: battle.status,
        currentTurn: battle.currentTurn,
        player1: battle.player1Data,
        player2: battle.player2Data
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'BATTLE_START_ERROR'
      }
    });
  }
});

// POST /api/battle/:battleId/turn - Executar turno
router.post('/:battleId/turn', validateBattle, (req, res) => {
  try {
    const { battleId } = req.params;
    const { playerId, action } = req.body;
    const battle = battles.get(battleId);

    if (battle.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Battle not active',
          code: 'BATTLE_NOT_ACTIVE'
        }
      });
    }

    if (battle.currentTurn !== playerId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Not your turn',
          code: 'NOT_YOUR_TURN'
        }
      });
    }

    console.log(`🔍 DEBUG: Executando turno - Player ${playerId}, Action:`, action);

    // Usar battleController existente
    const turnResult = battleController.executeTurn(action);

    // Alternar turno
    battle.currentTurn = playerId === 1 ? 2 : 1;

    // Atualizar dados dos Pokémon após o ataque
    battle.player1Data = battleController.player1Pokemon;
    battle.player2Data = battleController.player2Pokemon;

    // Verificar se batalha acabou
    if (turnResult.battleEnded) {
      battle.status = 'finished';
      battle.winner = turnResult.winner;
    }

    console.log(`🔍 DEBUG: Resultado do turno:`, turnResult);

    res.json({
      success: true,
      data: {
        battleId,
        ...turnResult,
        nextTurn: battle.currentTurn,
        battleStatus: battle.status
      }
    });
  } catch (error) {
    console.error('❌ DEBUG: Erro no executeTurn:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'TURN_EXECUTE_ERROR'
      }
    });
  }
});

// GET /api/battle/:battleId/status - Status da batalha
router.get('/:battleId/status', validateBattle, (req, res) => {
  try {
    const { battleId } = req.params;
    const battle = battles.get(battleId);

    res.json({
      success: true,
      data: battle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'BATTLE_STATUS_ERROR'
      }
    });
  }
});

// DELETE /api/battle/:battleId - Encerrar batalha
router.delete('/:battleId', validateBattle, (req, res) => {
  try {
    const { battleId } = req.params;

    // Usar battleController existente
    battleController.resetBattle();

    battles.delete(battleId);

    res.json({
      success: true,
      message: 'Battle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'BATTLE_DELETE_ERROR'
      }
    });
  }
});

export default router;
