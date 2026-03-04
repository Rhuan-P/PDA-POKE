<template>
  <div class="battle-arena">
    <div class="container">
      <h1>⚔️ Pokemon Battle Arena</h1>
      
      <!-- Health Check Status -->
      <div class="status-bar">
        <div :class="['status-indicator', { connected: apiConnected }]">
          {{ apiConnected ? '🟢 API Connected' : '🔴 API Disconnected' }}
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="error-message">
        <p>❌ {{ error }}</p>
        <button @click="clearError" class="btn-small">Dismiss</button>
      </div>

      <!-- Battle Creation -->
      <div v-if="!battle" class="battle-setup">
        <h2>Create New Battle</h2>
        <button @click="createBattle" :disabled="loading" class="btn-primary">
          {{ loading ? 'Creating...' : '⚔️ Create Battle' }}
        </button>
      </div>

      <!-- Debug Info -->
      <div class="debug-info" style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-size: 12px; z-index: 1000;">
        <p>🔍 DEBUG: battle = {{ battle }}</p>
        <p>🔍 DEBUG: isBattleActive = {{ isBattleActive }}</p>
        <p>🔍 DEBUG: isBattleWaiting = {{ isBattleWaiting }}</p>
        <p>🔍 DEBUG: selectedPokemons = {{ selectedPokemons }}</p>
        <p>🔍 DEBUG: currentTurn = {{ currentTurn }}</p>
      </div>

      <!-- Battle View - Versão Original Adaptada -->
      <div v-if="battle" class="battle-view">
        
        <!-- HEADER -->
        <header class="battle-header">
          <h1>⚔️ Pokémon Battle Simulator</h1>

          <div class="battle-info">
            <span class="status-badge" :class="statusClass">
              {{ battleStatus }}
            </span>

            <div class="header-controls">
              <button 
                class="primary-btn"
                :disabled="!canStartBattle"
                @click="startBattle"
                title="Selecione um Pokémon para cada jogador antes de iniciar"
              >
                Batalhar
              </button>

              <button 
                class="secondary-btn"
                @click="resetBattle"
              >
                Resetar
              </button>
            </div>

            <div v-if="isBattleActive" class="turn-indicator">
              Turno: Jogador {{ currentTurn }}
            </div>
          </div>
        </header>

        <!-- ARENA -->
        <section class="battle-arena">

          <!-- PLAYER 1 -->
          <article class="arena-section" :class="{ 'turn-active': isBattleActive && currentTurn === 1 }">
            <h2>🔵 Jogador 1</h2>
            <div class="player-area">
              <div v-if="selectedPokemons.player1" class="pokemon-display">
                <img :src="getPokemonSprite(selectedPokemons.player1)" :alt="selectedPokemons.player1" class="pokemon-sprite">
                <h3>{{ selectedPokemons.player1 }}</h3>
                <div class="pokemon-types">
                  <span 
                    v-for="type in getPokemonTypes(selectedPokemons.player1)" 
                    :key="type"
                    class="type-badge"
                    :style="{ backgroundColor: getTypeColor(type) }"
                  >
                    {{ type }}
                  </span>
                </div>
              </div>
              <div v-else class="no-pokemon">
                <p>Selecione um Pokémon</p>
              </div>
            </div>

            <div class="battle-actions">

            </div>
          </article>

          <!-- VS -->
          <div class="vs-divider">
            <div class="vs-circle">VS</div>
          </div>

          <!-- PLAYER 2 -->
          <article class="arena-section" :class="{ 'turn-active': isBattleActive && currentTurn === 2 }">
            <h2>🔴 Jogador 2</h2>
            <div class="player-area">
              <div v-if="selectedPokemons.player2" class="pokemon-display">
                <img :src="getPokemonSprite(selectedPokemons.player2)" :alt="selectedPokemons.player2" class="pokemon-sprite">
                <h3>{{ selectedPokemons.player2 }}</h3>
                <div class="pokemon-types">
                  <span 
                    v-for="type in getPokemonTypes(selectedPokemons.player2)" 
                    :key="type"
                    class="type-badge"
                    :style="{ backgroundColor: getTypeColor(type) }"
                  >
                    {{ type }}
                  </span>
                </div>
              </div>
              <div v-else class="no-pokemon">
                <p>Selecione um Pokémon</p>
              </div>
            </div>

            <div class="battle-actions">
            
            </div>
          </article>

        </section>

        <!-- POKEMON SELECTION (when waiting) -->
        <div v-if="battle.status === 'waiting'" class="pokemon-selection-overlay">
          <h2>Selecione seus Pokémon</h2>
          
          <div class="players-section">
            <!-- Player 1 Selection -->
            <div class="player-section">
              <h3>Jogador 1</h3>
              <div v-if="selectedPokemons.player1" class="selected-pokemon-card">
                <img :src="getPokemonSprite(selectedPokemons.player1)" :alt="selectedPokemons.player1" class="pokemon-sprite">
                <h4>{{ selectedPokemons.player1 }}</h4>
                <span class="selected-badge">✅ Selecionado</span>
              </div>
              <div v-else class="pokemon-grid">
                <div 
                  v-for="pokemon in pokemonList" 
                  :key="pokemon.name"
                  class="pokemon-card"
                  @click="selectPokemonForPlayer(1, pokemon.name)"
                >
                  <img :src="getPokemonSprite(pokemon.name)" :alt="pokemon.name" class="pokemon-sprite">
                  <h4>{{ pokemon.name }}</h4>
                  <div class="pokemon-types">
                    <span 
                      v-for="type in getPokemonTypes(pokemon.name)" 
                      :key="type"
                      class="type-badge"
                      :style="{ backgroundColor: getTypeColor(type) }"
                    >
                      {{ type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Player 2 Selection -->
            <div class="player-section">
              <h3>Jogador 2</h3>
              <div v-if="selectedPokemons.player2" class="selected-pokemon-card">
                <img :src="getPokemonSprite(selectedPokemons.player2)" :alt="selectedPokemons.player2" class="pokemon-sprite">
                <h4>{{ selectedPokemons.player2 }}</h4>
                <span class="selected-badge">✅ Selecionado</span>
              </div>
              <div v-else class="pokemon-grid">
                <div 
                  v-for="pokemon in pokemonList" 
                  :key="pokemon.name"
                  class="pokemon-card"
                  @click="selectPokemonForPlayer(2, pokemon.name)"
                >
                  <img :src="getPokemonSprite(pokemon.name)" :alt="pokemon.name" class="pokemon-sprite">
                  <h4>{{ pokemon.name }}</h4>
                  <div class="pokemon-types">
                    <span 
                      v-for="type in getPokemonTypes(pokemon.name)" 
                      :key="type"
                      class="type-badge"
                      :style="{ backgroundColor: getTypeColor(type) }"
                    >
                      {{ type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LOG -->
        <section class="battle-log">
          <h3>📜 Log da Batalha</h3>

          <div class="log-content">
            <p
              v-for="(log, index) in battleLog"
              :key="index"
              class="log-entry"
            >
              {{ log }}
            </p>

            <p v-if="battleLog.length === 0" class="log-empty">
              Nenhuma ação registrada ainda.
            </p>
          </div>
        </section>

        <!-- MODAL -->
        <div
          v-if="showResultModal"
          class="modal-overlay"
          @click="hideResultModal"
        >
          <div class="modal-content" @click.stop>
            <h2>🏆 Resultado da Batalha</h2>

            <p v-if="battleWinner">
              {{ battleWinner }} venceu a batalha!
            </p>

            <p v-else>
              Houve empate!
            </p>

            <button class="primary-btn" @click="resetBattle">
              Jogar Novamente
            </button>
          </div>
        </div>

      </div>

      <!-- Battle Finished -->
      <div v-if="battle?.status === 'finished'" class="battle-finished">
        <h2>🏆 Battle Finished!</h2>
        <p class="winner-text">Winner: {{ battleWinner }}</p>
        <button @click="resetBattle" class="btn-secondary">
          New Battle
        </button>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { pokeApiService } from '../services/pokeApiService.js';
import { useBattleStore } from '../stores/battleStore.js';

console.log('🔍 DEBUG: pokeApiService importado:', pokeApiService);
console.log('🔍 DEBUG: Métodos disponíveis:', Object.getOwnPropertyNames(pokeApiService));

export default {
  name: 'BattleArena',
  setup() {
    const battleStore = useBattleStore();
    
    // Local state
    const player1Selection = ref('');
    const player2Selection = ref('');
    const apiConnected = ref(false);

    // Computed properties from store
    const battle = computed(() => battleStore.battle);
    const loading = computed(() => battleStore.loading);
    const error = computed(() => battleStore.error);
    const pokemonList = computed(() => battleStore.pokemonList);
    const selectedPokemons = computed(() => battleStore.selectedPokemons);
    const isBattleActive = computed(() => battleStore.isBattleActive);
    const isBattleReady = computed(() => battleStore.isBattleReady);
    const isBattleWaiting = computed(() => battleStore.isBattleWaiting);
    const currentTurn = computed(() => battleStore.currentTurn);
    const battleWinner = computed(() => battleStore.battleWinner);

    // Battle status computed
    const battleStatus = computed(() => {
      if (!battle.value) return 'Aguardando';
      if (battle.value.status === 'waiting') return 'Aguardando seleção';
      if (battle.value.status === 'active') return 'Em batalha';
      if (battle.value.status === 'finished') return 'Finalizada';
      return 'Desconhecido';
    });

    const canStartBattle = computed(() => {
      return selectedPokemons.value.player1 && selectedPokemons.value.player2 && battle.value?.status === 'waiting';
    });

    const showResultModal = computed(() => {
      return battle.value?.status === 'finished' && battleWinner.value;
    });

    const battleLog = computed(() => {
      // Simulação de log - poderia vir do backend
      const logs = [];
      if (selectedPokemons.value.player1 && selectedPokemons.value.player2) {
        logs.push(`${selectedPokemons.value.player1} vs ${selectedPokemons.value.player2}`);
      }
      if (isBattleActive.value) {
        logs.push(`Batalha iniciada! Turno do Jogador ${currentTurn.value}`);
      }
      return logs;
    });

    const statusClass = computed(() => {
      if (battleStatus.value === 'Em batalha') return 'active';
      if (battleStatus.value === 'Finalizada') return 'finished';
      return 'waiting';
    });

    // Methods
    const getPokemonSprite = (pokemonName) => {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemonName)}.png`;
    };

    const getPokemonId = (pokemonName) => {
      // Mapeamento completo para os primeiros 151 Pokémon
      const pokemonIds = {
        // Kanto First Generation (1-151)
        'bulbasaur': 1, 'ivysaur': 2, 'venusaur': 3,
        'charmander': 4, 'charmeleon': 5, 'charizard': 6,
        'squirtle': 7, 'wartortle': 8, 'blastoise': 9,
        'caterpie': 10, 'metapod': 11, 'butterfree': 12,
        'weedle': 13, 'kakuna': 14, 'beedrill': 15,
        'pidgey': 16, 'pidgeotto': 17, 'pidgeot': 18,
        'rattata': 19, 'raticate': 20,
        'spearow': 21, 'fearow': 22,
        'ekans': 23, 'arbok': 24,
        'pikachu': 25, 'raichu': 26,
        'sandshrew': 27, 'sandslash': 28,
        'nidoran-f': 29, 'nidorina': 30, 'nidoqueen': 31,
        'nidoran-m': 32, 'nidorino': 33, 'nidoking': 34,
        'clefairy': 35, 'clefable': 36,
        'vulpix': 37, 'ninetales': 38,
        'jigglypuff': 39, 'wigglytuff': 40,
        'zubat': 41, 'golbat': 42,
        'oddish': 43, 'gloom': 44, 'vileplume': 45,
        'paras': 46, 'parasect': 47,
        'venonat': 48, 'venomoth': 49,
        'diglett': 50, 'dugtrio': 51,
        'meowth': 52, 'persian': 53,
        'psyduck': 54, 'golduck': 55,
        'mankey': 56, 'primeape': 57,
        'growlithe': 58, 'arcanine': 59,
        'poliwag': 60, 'poliwhirl': 61, 'poliwrath': 62,
        'abra': 63, 'kadabra': 64, 'alakazam': 65,
        'machop': 66, 'machoke': 67, 'machamp': 68,
        'bellsprout': 69, 'weepinbell': 70, 'victreebel': 71,
        'tentacool': 72, 'tentacruel': 73,
        'geodude': 74, 'graveler': 75, 'golem': 76,
        'ponyta': 77, 'rapidash': 78,
        'slowpoke': 79, 'slowbro': 80,
        'magnemite': 81, 'magneton': 82,
        'farfetchd': 83,
        'doduo': 84, 'dodrio': 85,
        'seel': 86, 'dewgong': 87,
        'grimer': 88, 'muk': 89,
        'shellder': 90, 'cloyster': 91,
        'gastly': 92, 'haunter': 93, 'gengar': 94,
        'onix': 95,
        'drowzee': 96, 'hypno': 97,
        'krabby': 98, 'kingler': 99,
        'voltorb': 100, 'electrode': 101,
        'exeggcute': 102, 'exeggutor': 103,
        'cubone': 104, 'marowak': 105,
        'hitmonlee': 106, 'hitmonchan': 107, 'hitmontop': 108,
        'lickitung': 109,
        'koffing': 110, 'weezing': 111,
        'rhyhorn': 112, 'rhydon': 113,
        'chansey': 114,
        'tangela': 115,
        'kangaskhan': 116,
        'horsea': 117, 'seadra': 118,
        'goldeen': 119, 'seaking': 120,
        'staryu': 121, 'starmie': 122,
        'mr-mime': 123,
        'scyther': 124,
        'jynx': 125,
        'electabuzz': 126,
        'magmar': 127,
        'pinsir': 128,
        'tauros': 129,
        'magikarp': 130, 'gyarados': 131,
        'lapras': 132,
        'ditto': 133,
        'eevee': 134, 'vaporeon': 135, 'jolteon': 136, 'flareon': 137,
        'porygon': 138,
        'omanyte': 139, 'omastar': 140,
        'kabuto': 141, 'kabutops': 142,
        'aerodactyl': 143,
        'snorlax': 144,
        'articuno': 145,
        'zapdos': 146,
        'moltres': 147,
        'dratini': 148, 'dragonair': 149, 'dragonite': 150,
        'mewtwo': 151, 'mew': 151 // Mew também usa 151
      };
      
      const normalizedName = pokemonName.toLowerCase().trim();
      return pokemonIds[normalizedName] || 25; // Default para Pikachu se não encontrado
    };

    const getPokemonTypes = (pokemonName) => {
      // Mapeamento de tipos para os primeiros 151 Pokémon
      const pokemonTypes = {
        // Kanto First Generation
        'bulbasaur': ['grass', 'poison'], 'ivysaur': ['grass', 'poison'], 'venusaur': ['grass', 'poison'],
        'charmander': ['fire'], 'charmeleon': ['fire'], 'charizard': ['fire', 'flying'],
        'squirtle': ['water'], 'wartortle': ['water'], 'blastoise': ['water'],
        'caterpie': ['bug'], 'metapod': ['bug'], 'butterfree': ['bug', 'flying'],
        'weedle': ['bug', 'poison'], 'kakuna': ['bug', 'poison'], 'beedrill': ['bug', 'poison'],
        'pidgey': ['normal', 'flying'], 'pidgeotto': ['normal', 'flying'], 'pidgeot': ['normal', 'flying'],
        'rattata': ['normal'], 'raticate': ['normal'],
        'spearow': ['normal', 'flying'], 'fearow': ['normal', 'flying'],
        'ekans': ['poison'], 'arbok': ['poison'],
        'pikachu': ['electric'], 'raichu': ['electric'],
        'sandshrew': ['ground'], 'sandslash': ['ground'],
        'nidoran-f': ['poison'], 'nidorina': ['poison'], 'nidoqueen': ['poison', 'ground'],
        'nidoran-m': ['poison'], 'nidorino': ['poison'], 'nidoking': ['poison', 'ground'],
        'clefairy': ['fairy'], 'clefable': ['fairy'],
        'vulpix': ['fire'], 'ninetales': ['fire'],
        'jigglypuff': ['normal', 'fairy'], 'wigglytuff': ['normal', 'fairy'],
        'zubat': ['poison', 'flying'], 'golbat': ['poison', 'flying'],
        'oddish': ['grass', 'poison'], 'gloom': ['grass', 'poison'], 'vileplume': ['grass', 'poison'],
        'paras': ['bug', 'grass'], 'parasect': ['bug', 'grass'],
        'venonat': ['bug', 'poison'], 'venomoth': ['bug', 'poison'],
        'diglett': ['ground'], 'dugtrio': ['ground'],
        'meowth': ['normal'], 'persian': ['normal'],
        'psyduck': ['water'], 'golduck': ['water'],
        'mankey': ['fighting'], 'primeape': ['fighting'],
        'growlithe': ['fire'], 'arcanine': ['fire'],
        'poliwag': ['water'], 'poliwhirl': ['water'], 'poliwrath': ['water', 'fighting'],
        'abra': ['psychic'], 'kadabra': ['psychic'], 'alakazam': ['psychic'],
        'machop': ['fighting'], 'machoke': ['fighting'], 'machamp': ['fighting'],
        'bellsprout': ['grass', 'poison'], 'weepinbell': ['grass', 'poison'], 'victreebel': ['grass', 'poison'],
        'tentacool': ['water', 'poison'], 'tentacruel': ['water', 'poison'],
        'geodude': ['rock', 'ground'], 'graveler': ['rock', 'ground'], 'golem': ['rock', 'ground'],
        'ponyta': ['fire'], 'rapidash': ['fire'],
        'slowpoke': ['water', 'psychic'], 'slowbro': ['water', 'psychic'],
        'magnemite': ['electric', 'steel'], 'magneton': ['electric', 'steel'],
        'farfetchd': ['normal', 'flying'],
        'doduo': ['normal', 'flying'], 'dodrio': ['normal', 'flying'],
        'seel': ['water'], 'dewgong': ['water'],
        'grimer': ['poison'], 'muk': ['poison'],
        'shellder': ['water'], 'cloyster': ['water'],
        'gastly': ['ghost', 'poison'], 'haunter': ['ghost', 'poison'], 'gengar': ['ghost', 'poison'],
        'onix': ['rock', 'ground'],
        'drowzee': ['psychic'], 'hypno': ['psychic'],
        'krabby': ['water'], 'kingler': ['water'],
        'voltorb': ['electric'], 'electrode': ['electric'],
        'exeggcute': ['grass', 'psychic'], 'exeggutor': ['grass', 'psychic'],
        'cubone': ['ground'], 'marowak': ['ground'],
        'hitmonlee': ['fighting'], 'hitmonchan': ['fighting'], 'hitmontop': ['fighting'],
        'lickitung': ['normal'],
        'koffing': ['poison'], 'weezing': ['poison'],
        'rhyhorn': ['ground', 'rock'], 'rhydon': ['ground', 'rock'],
        'chansey': ['normal'],
        'tangela': ['grass'],
        'kangaskhan': ['normal'],
        'horsea': ['water'], 'seadra': ['water'],
        'goldeen': ['water'], 'seaking': ['water'],
        'staryu': ['water'], 'starmie': ['water', 'psychic'],
        'mr-mime': ['psychic', 'fairy'],
        'scyther': ['bug', 'flying'],
        'jynx': ['ice', 'psychic'],
        'electabuzz': ['electric'],
        'magmar': ['fire'],
        'pinsir': ['bug'],
        'tauros': ['normal'],
        'magikarp': ['water'], 'gyarados': ['water', 'flying'],
        'lapras': ['water', 'ice'],
        'ditto': ['normal'],
        'eevee': ['normal'], 'vaporeon': ['water'], 'jolteon': ['electric'], 'flareon': ['fire'],
        'porygon': ['normal'],
        'omanyte': ['rock', 'water'], 'omastar': ['rock', 'water'],
        'kabuto': ['rock', 'bug'], 'kabutops': ['rock', 'bug'],
        'aerodactyl': ['rock', 'flying'],
        'snorlax': ['normal'],
        'articuno': ['ice', 'flying'],
        'zapdos': ['electric', 'flying'],
        'moltres': ['fire', 'flying'],
        'dratini': ['dragon'], 'dragonair': ['dragon'], 'dragonite': ['dragon', 'flying'],
        'mewtwo': ['psychic'], 'mew': ['psychic']
      };
      
      const normalizedName = pokemonName.toLowerCase().trim();
      return pokemonTypes[normalizedName] || ['normal'];
    };

    const getTypeColor = (type) => {
      const typeColors = {
        'normal': '#A8A878', 'fire': '#F08030', 'water': '#6890F0',
        'electric': '#F8D030', 'grass': '#78C850', 'ice': '#98D8D8',
        'fighting': '#C03028', 'poison': '#A040A0', 'ground': '#E0C068',
        'flying': '#A890F0', 'psychic': '#F85888', 'bug': '#A8B820',
        'rock': '#B8A038', 'ghost': '#705898', 'dragon': '#7038F8',
        'dark': '#705848', 'steel': '#B8B8D0', 'fairy': '#EE99AC'
      };
      return typeColors[type] || '#68A090';
    };

    const getHpColor = (hp) => {
      if (hp > 50) return '#4CAF50'; // Verde
      if (hp > 20) return '#FFC107'; // Amarelo
      return '#F44336'; // Vermelho
    };

    const getPokemonHp = (playerId) => {
      // Simulação de HP - poderia vir do backend
      const hpData = {
        1: 85, // Player 1 HP
        2: 92  // Player 2 HP
      };
      return hpData[playerId] || 100;
    };

    const checkApiConnection = async () => {
      try {
        console.log('🔍 DEBUG: Tentando healthCheck...');
        await pokeApiService.healthCheck();
        apiConnected.value = true;
        console.log('✅ DEBUG: API conectada com sucesso!');
      } catch (error) {
        apiConnected.value = false;
        console.error('❌ DEBUG: API connection failed:', error);
      }
    };

    const createBattle = async () => {
      try {
        console.log('🔍 DEBUG: Tentando criar batalha...');
        await battleStore.createBattle();
        console.log('✅ DEBUG: Batalha criada com sucesso!');
      } catch (error) {
        console.error('❌ DEBUG: Failed to create battle:', error);
      }
    };

    const selectPokemonForPlayer = async (playerId, pokemonName) => {
      if (!pokemonName) return;
      
      console.log(`🔍 DEBUG: Selecionando Pokémon ${pokemonName} para jogador ${playerId}...`);
      
      try {
        await battleStore.selectPokemon(playerId, pokemonName);
        console.log(`✅ DEBUG: Pokémon ${pokemonName} selecionado com sucesso!`);
        console.log('🔍 DEBUG: Estado atual:', battleStore.battle);
        console.log('🔍 DEBUG: selectedPokemons:', battleStore.selectedPokemons);
        
        if (playerId === 1) player1Selection.value = '';
        if (playerId === 2) player2Selection.value = '';
      } catch (error) {
        console.error('❌ DEBUG: Failed to select Pokemon:', error);
      }
    };

    const startBattle = async () => {
      console.log('🔍 DEBUG: Tentando iniciar batalha...');
      console.log('🔍 DEBUG: Estado antes de iniciar:', battleStore.battle);
      
      try {
        await battleStore.startBattle();
        console.log('✅ DEBUG: Batalha iniciada com sucesso!');
        console.log('🔍 DEBUG: Estado após iniciar:', battleStore.battle);
      } catch (error) {
        console.error('❌ DEBUG: Failed to start battle:', error);
      }
    };

    const hideResultModal = () => {
      // Esconder modal - poderia ser implementado no store
    };

    const executeTurn = async (playerId) => {
      try {
        await battleStore.executeTurn(playerId, 'attack');
      } catch (error) {
        console.error('Failed to execute turn:', error);
      }
    };

    const resetBattle = () => {
      battleStore.resetBattle();
      player1Selection.value = '';
      player2Selection.value = '';
    };

    const clearError = () => {
      battleStore.clearError();
    };

    // Lifecycle
    onMounted(async () => {
      await checkApiConnection();
      await battleStore.loadPokemonList();
      
      // Check API connection periodically
      setInterval(checkApiConnection, 30000);
    });

    return {
      battle,
      loading,
      error,
      pokemonList,
      selectedPokemons,
      isBattleActive,
      isBattleReady,
      isBattleWaiting,
      currentTurn,
      battleWinner,
      battleStatus,
      canStartBattle,
      showResultModal,
      battleLog,
      statusClass,
      player1Selection,
      player2Selection,
      apiConnected,
      getPokemonSprite,
      getPokemonId,
      getPokemonTypes,
      getTypeColor,
      getHpColor,
      getPokemonHp,
      createBattle,
      selectPokemonForPlayer,
      startBattle,
      executeTurn,
      resetBattle,
      clearError,
      hideResultModal
    };
  }
};
</script>

<style scoped>
.battle-arena {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.status-bar {
  text-align: center;
  margin-bottom: 20px;
}

.status-indicator {
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  background: #fee;
  color: #c33;
}

.status-indicator.connected {
  background: #efe;
  color: #3c3;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.battle-setup, .pokemon-selection, .battle-active, .battle-finished {
  text-align: center;
  margin: 30px 0;
}

.players-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 30px 0;
}

.player-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.selected-pokemon {
  font-size: 18px;
  font-weight: bold;
  color: #28a745;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px dashed #dee2e6;
}

.pokemon-card {
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.pokemon-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  border-color: #007bff;
}

.pokemon-card.selected {
  border-color: #28a745;
  background: #e7f5e7;
  transform: scale(1.05);
}

.pokemon-sprite {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 8px;
}

.pokemon-card h4 {
  margin: 0 0 5px 0;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  text-transform: capitalize;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.type-badge {
  font-size: 8px;
  padding: 2px 4px;
  border-radius: 4px;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  margin: 1px;
  display: inline-block;
}

.selected-pokemon-card {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.selected-pokemon-card .pokemon-sprite {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.selected-pokemon-card h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: bold;
  text-transform: capitalize;
}

.selected-badge {
  display: inline-block;
  padding: 5px 10px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.start-section {
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  border-radius: 15px;
}

.start-section .btn-primary {
  background: white;
  color: #007bff;
  font-size: 18px;
  padding: 15px 40px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-section .btn-primary:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

/* Scrollbar styling */
.pokemon-grid::-webkit-scrollbar {
  width: 8px;
}

.pokemon-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.pokemon-grid::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.pokemon-grid::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.battle-field {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  margin: 30px 0;
}

.pokemon-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 20px;
  border-radius: 15px;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.pokemon-card.active {
  border-color: #007bff;
  background: linear-gradient(135deg, #e7f3ff, #cce7ff);
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,123,255,0.3);
}

.pokemon-card.low-hp {
  border-color: #dc3545;
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  animation: pulse 1s infinite;
}

.pokemon-header {
  margin-bottom: 15px;
}

.pokemon-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-transform: capitalize;
}

.battle-sprite {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin: 10px auto;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.pokemon-info {
  margin-top: 15px;
}

.pokemon-info p {
  margin: 0 0 10px 0;
  font-weight: bold;
  color: #666;
}

.hp-container {
  margin-bottom: 10px;
}

.hp-text {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.hp-bar {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid #dee2e6;
}

.hp-fill {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
  border-radius: 5px;
}

.status-effects {
  margin-top: 10px;
}

.turn-indicator {
  display: inline-block;
  padding: 4px 8px;
  background: #28a745;
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  animation: glow 1s infinite alternate;
}

.waiting-indicator {
  display: inline-block;
  padding: 4px 8px;
  background: #6c757d;
  color: white;
  border-radius: 12px;
  font-size: 11px;
}

@keyframes glow {
  from { box-shadow: 0 0 5px rgba(40, 167, 69, 0.5); }
  to { box-shadow: 0 0 15px rgba(40, 167, 69, 0.8); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.vs-indicator {
  text-align: center;
  padding: 20px;
}

.vs-text {
  font-size: 32px;
  font-weight: bold;
  color: #dc3545;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  margin-bottom: 5px;
}

.turn-info {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.battle-controls {
  margin-top: 30px;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 15px;
  border: 2px solid #dee2e6;
}

.turn-indicator {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #007bff;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.attack-btn {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  font-size: 16px;
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.attack-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0,123,255,0.3);
}

.retreat-btn {
  background: linear-gradient(135deg, #6c757d, #545b62);
  color: white;
  font-size: 14px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retreat-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(108,117,125,0.3);
}

.battle-log {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #dee2e6;
}

.battle-log h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.log-entries {
  max-height: 150px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  padding: 10px;
}

.log-entry {
  display: flex;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
}

.log-time {
  color: #666;
  font-weight: bold;
  min-width: 60px;
}

.log-text {
  color: #333;
  flex: 1;
}

.btn-primary, .btn-secondary, .btn-small {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
  background: #dc3545;
  color: white;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.winner-text {
  font-size: 24px;
  font-weight: bold;
  color: #28a745;
  margin: 20px 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
