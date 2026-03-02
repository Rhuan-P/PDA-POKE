import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PokemonSelectionUseCase } from '../../application/use-cases/PokemonSelectionUseCase';
import { BattleUseCase } from '../../application/use-cases/BattleUseCase';
import { pokeApiService } from '../../services/pokeApiService.js';

const pokemonServiceAdapter = {
  getPokemon: (id) => pokeApiService.getPokemon(id),
  getPokemonByName: (name) => pokeApiService.getPokemonByName(name),
  getSkill: (id) => pokeApiService.getSkill(id),
};

export const useGameStore = defineStore('game', () => {
  const player1 = ref({ pokemon: null, ready: false });
  const player2 = ref({ pokemon: null, ready: false });

  const battleStatus = ref('waiting');
  const currentTurn = ref(1);
  const battleLog = ref([]);
  const winner = ref(null);
  const showResultModal = ref(false);
  const loading = ref(false);
  const error = ref('');

  const canStartBattle = computed(() =>
    player1.value.pokemon && player2.value.pokemon &&
    player1.value.ready && player2.value.ready &&
    battleStatus.value === 'waiting'
  );

  const isBattleActive = computed(() => battleStatus.value === 'fighting');

  const addLogEntry = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    battleLog.value.push(`[${timestamp}] ${message}`);
    if (battleLog.value.length > 50) {
      battleLog.value = battleLog.value.slice(-50);
    }
  };

  const setPlayerPokemon = (playerId, pokemon) => {
    if (playerId === 1) {
      player1.value.pokemon = pokemon;
      player1.value.ready = true;
    } else {
      player2.value.pokemon = pokemon;
      player2.value.ready = true;
    }
    addLogEntry(`Jogador ${playerId} selecionou ${pokemon.name}`);
  };

  const selectPokemon = async (playerId, pokemonName) => {
    loading.value = true;
    error.value = '';
    try {
      const useCase = new PokemonSelectionUseCase(pokemonServiceAdapter);
      const pokemon = await useCase.selectPokemon(playerId, pokemonName);
      const pokemonState = {
        id: pokemon.id,
        name: pokemon.name,
        level: pokemon.level,
        types: pokemon.types,
        stats: { ...pokemon.stats },
        sprite: pokemon.sprite,
      };
      setPlayerPokemon(playerId, pokemonState);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const startBattle = () => {
    if (!canStartBattle.value) return;
    battleStatus.value = 'fighting';
    currentTurn.value = 1;
    addLogEntry(' Batalha iniciada!');
  };

  const executeTurn = async (action) => {
    if (!isBattleActive.value) return;

    const attacker = currentTurn.value === 1 ? player1.value.pokemon : player2.value.pokemon;
    const defender = currentTurn.value === 1 ? player2.value.pokemon : player1.value.pokemon;

    const battleStoreAdapter = {
      applyDamage: (pokemonId, damage) => {
        if (player1.value.pokemon?.id === pokemonId) {
          player1.value.pokemon.stats.hp = Math.max(0, player1.value.pokemon.stats.hp - damage);
        } else if (player2.value.pokemon?.id === pokemonId) {
          player2.value.pokemon.stats.hp = Math.max(0, player2.value.pokemon.stats.hp - damage);
        }
      },
      getCurrentHp: (pokemonId) => {
        if (player1.value.pokemon?.id === pokemonId) return player1.value.pokemon.stats.hp;
        if (player2.value.pokemon?.id === pokemonId) return player2.value.pokemon.stats.hp;
        return 0;
      },
    };

    const damageCalculatorAdapter = {
      calculate: (attacker, defender, skill) => {
        const base = Math.max(1, attacker.stats.attack - defender.stats.defense);
        return Math.floor(base * (0.8 + Math.random() * 0.4));
      },
    };

    try {
      const useCase = new BattleUseCase(
        pokemonServiceAdapter,
        damageCalculatorAdapter,
        battleStoreAdapter
      );

      const result = await useCase.executeAttack(attacker.id, defender.id, 'tackle');

      addLogEntry(`⚔️ ${result.attacker.name} atacou ${result.defender.name} e causou ${result.damage} de dano!`);

      if (defender.stats.hp <= 0) {
        endBattle(currentTurn.value);
        return;
      }

      currentTurn.value = currentTurn.value === 1 ? 2 : 1;
      addLogEntry(`Vez do Jogador ${currentTurn.value}`);
    } catch (err) {
      error.value = err.message;
    }
  };

  const endBattle = (winnerId) => {
    battleStatus.value = 'finished';
    winner.value = winnerId === 1 ? player1.value.pokemon : player2.value.pokemon;
    showResultModal.value = true;
    addLogEntry(`🏆 ${winner.value.name} venceu a batalha!`);
  };

  const resetBattle = () => {
    player1.value = { pokemon: null, ready: false };
    player2.value = { pokemon: null, ready: false };
    battleStatus.value = 'waiting';
    currentTurn.value = 1;
    battleLog.value = [];
    winner.value = null;
    showResultModal.value = false;
    loading.value = false;
    error.value = '';
    addLogEntry(' Batalha resetada');
  };

  const hideResultModal = () => {
    showResultModal.value = false;
  };

  const setLoading = (isLoading) => { loading.value = isLoading; };
  const setError = (errorMessage) => { error.value = errorMessage; };

  addLogEntry('🎮 Pokémon Battle Simulator iniciado');

  return {
    player1, player2, battleStatus, currentTurn, battleLog,
    winner, showResultModal, loading, error,
    canStartBattle, isBattleActive,
    setPlayerPokemon, selectPokemon, startBattle,
    executeTurn, endBattle, resetBattle,
    hideResultModal, addLogEntry, setLoading, setError,
  };
});