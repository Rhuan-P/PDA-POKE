/**
 * Rotas da API para Pokémon
 * Aproveitando pokeApiService existente
 */

import express from 'express';
import { pokeApiService } from '../services/pokeApiService.js';

const router = express.Router();

// GET /api/pokemon - Listar Pokémon
router.get('/', async (req, res) => {
  try {
    const { limit = 151, offset = 0 } = req.query;
    const result = await pokeApiService.getPokemonList(parseInt(limit), parseInt(offset));
    res.json({
      success: true,
      data: result,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.count || 151
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'POKEMON_LIST_ERROR'
      }
    });
  }
});

// GET /api/pokemon/:idOrName - Buscar Pokémon específico
router.get('/:idOrName', async (req, res) => {
  try {
    const { idOrName } = req.params;
    const pokemon = await pokeApiService.getPokemon(idOrName);

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pokémon not found',
          code: 'POKEMON_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: pokemon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'POKEMON_FETCH_ERROR'
      }
    });
  }
});

// GET /api/pokemon/search/:name - Buscar Pokémon por nome
router.get('/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const pokemon = await pokeApiService.searchPokemon(name);

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pokémon not found',
          code: 'POKEMON_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: pokemon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'POKEMON_SEARCH_ERROR'
      }
    });
  }
});

export default router;
