/**
 * Estado Global da AplicaÃ§Ã£o - Pinia Store
 * Time UX: Implementar aqui o estado reativo da aplicaÃ§Ã£o
 * Vue como biblioteca: usar apenas reatividade do Pinia
 * 
 * O que implementar:
 * - Estado dos jogadores e PokÃ©mon
 * - Estado da batalha
 * - Estado da UI (loading, errors)
 * - Log de eventos da batalha
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGameStore = defineStore('game', () => {
  // Estado dos jogadores
  const player1 = ref({
    pokemon: null,
    ready: false
  });
  
  const player2 = ref({
    pokemon: null,
    ready: false
  });

  // Estado da batalha
  const battleStatus = ref('waiting'); // waiting, ready, fighting, finished
  const currentTurn = ref(1); // 1 ou 2
  const battleLog = ref([]);
  const winner = ref(null);
  const showResultModal = ref(false);

  // Estado da UI
  const loading = ref(false);
  const error = ref('');

  // Getters computados
  const canStartBattle = computed(() => {
    const result = player1.value.pokemon && player2.value.pokemon && 
           player1.value.ready && player2.value.ready &&
           battleStatus.value === 'waiting';
    console.log('ðŸ” canStartBattle computed:', result);
    console.log('ðŸ” player1.pokemon:', player1.value.pokemon);
    console.log('ðŸ” player2.pokemon:', player2.value.pokemon);
    console.log('ðŸ” player1.ready:', player1.value.ready);
    console.log('ðŸ” player2.ready:', player2.value.ready);
    console.log('ðŸ” battleStatus:', battleStatus.value);
    return result;
  });

  const isBattleActive = computed(() => {
    return battleStatus.value === 'fighting';
  });

  // Actions
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

  const startBattle = () => {
    if (!canStartBattle.value) return;
    
    battleStatus.value = 'fighting';
    currentTurn.value = 1;
    addLogEntry('âš”ï¸ Batalha iniciada!');
    addLogEntry(`Jogador ${currentTurn.value} comeÃ§a atacando!`);
  };

  const executeTurn = (action) => {
    if (!isBattleActive.value) return;
    
    const attacker = currentTurn.value === 1 ? player1.value.pokemon : player2.value.pokemon;
    const defender = currentTurn.value === 1 ? player2.value.pokemon : player1.value.pokemon;
    
    // LÃ³gica de dano simples
    const damage = Math.max(1, attacker.stats.attack - defender.stats.defense);
    const actualDamage = Math.floor(damage * (0.8 + Math.random() * 0.4)); // 80-120% do dano base
    
    defender.stats.hp = Math.max(0, defender.stats.hp - actualDamage);
    
    addLogEntry(`âš”ï¸ ${attacker.name} atacou ${defender.name} e causou ${actualDamage} de dano!`);
    
    // Verificar se o defensor foi derrotado
    if (defender.stats.hp <= 0) {
      const winnerId = currentTurn.value;
      endBattle(winnerId);
      return;
    }
    
    // Trocar turno
    currentTurn.value = currentTurn.value === 1 ? 2 : 1;
    addLogEntry(`ðŸ”„ Vez do Jogador ${currentTurn.value}`);
  };

  const endBattle = (winnerId) => {
    battleStatus.value = 'finished';
    winner.value = winnerId === 1 ? player1.value.pokemon : player2.value.pokemon;
    showResultModal.value = true;
    
    addLogEntry(`ðŸ† ${winner.value.name} venceu a batalha!`);
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
    
    addLogEntry('ðŸ”„ Batalha resetada');
  };

  const hideResultModal = () => {
    showResultModal.value = false;
  };

  const addLogEntry = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    battleLog.value.push(`[${timestamp}] ${message}`);
    
    // Manter apenas os Ãºltimos 50 logs
    if (battleLog.value.length > 50) {
      battleLog.value = battleLog.value.slice(-50);
    }
  };

  const setLoading = (isLoading) => {
    loading.value = isLoading;
  };

  const setError = (errorMessage) => {
    error.value = errorMessage;
    if (errorMessage) {
      addLogEntry(`âŒ Erro: ${errorMessage}`);
    }
  };

  // Estado inicial
  addLogEntry('ðŸŽ® PokÃ©mon Battle Simulator iniciado');

  return {
    // Estado
    player1,
    player2,
    battleStatus,
    currentTurn,
    battleLog,
    winner,
    showResultModal,
    loading,
    error,
    
    // Getters
    canStartBattle,
    isBattleActive,
    
    // Actions
    setPlayerPokemon,
    startBattle,
    executeTurn,
    endBattle,
    resetBattle,
    hideResultModal,
    addLogEntry,
    setLoading,
    setError
  };
});

// O store jÃ¡ Ã© exportado na linha 16
