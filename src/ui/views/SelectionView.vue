<template>
  <main class="selection-view">
    
    <!-- HEADER -->
    <header class="selection-header">
      
      <div class="header-info">
        <span class="status-badge" :class="statusClass">
          {{ selectionStatus }}
        </span>

      </div>
    </header>

    <!-- LOADING STATE -->
    <div v-if="loading || !battleStore.battle" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h2>Preparando arena...</h2>
        <p>Carregando Pokémon e criando batalha</p>
      </div>
    </div>

    <!-- MAIN SELECTION -->
    <section class="main-selection">
      
      <p class="selection-description">
        Escolha seus Pokémon para a batalha. Eles aparecerão prontos na arena!
      </p>
      
      <div class="players-selection">
        <!-- PLAYER 1 SELECTION -->
        <PlayerSelection
          :player-id="1"
          :selected-pokemon="selectedPokemons.player1"
          :pokemon-list="pokemonList"
          @select-pokemon="selectPokemonForPlayer"
          @clear-selection="clearSelection"
        />

        <!-- VS -->
        <div class="vs-divider">
          <div class="vs-circle">VS</div>
        </div>

        <!-- PLAYER 2 SELECTION -->
        <PlayerSelection
          :player-id="2"
          :selected-pokemon="selectedPokemons.player2"
          :pokemon-list="pokemonList"
          @select-pokemon="selectPokemonForPlayer"
          @clear-selection="clearSelection"
        />
      </div>
    </section>

    <!-- ACTION BAR -->
    <footer class="action-bar">
      <div class="action-info">
        <p v-if="!selectedPokemons.player1 || !selectedPokemons.player2" class="warning">
          ⚠️ Selecione um Pokémon para cada jogador
        </p>
        <p v-else class="ready">
          ✅ Pronto para batalhar!
        </p>
      </div>
      
      <div class="action-buttons">
        <button 
          class="secondary-btn"
          @click="resetSelection"
        >
          Resetar Seleção
        </button>
        
        <button 
          class="primary-btn"
          :class="{ 'pulse-ready': canStartBattle }"
          :disabled="!canStartBattle"
          @click="startBattle"
        >
          ⚔️ Iniciar Batalha
        </button>
      </div>
    </footer>

  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBattleStore } from '../../stores/battleStore.js'
import PlayerSelection from '../components/PlayerSelection.vue'

const router = useRouter()
const battleStore = useBattleStore()

// Computed properties
const pokemonList = computed(() => battleStore.pokemonList)
const selectedPokemons = computed(() => battleStore.selectedPokemons)
const loading = computed(() => battleStore.loading)
const error = computed(() => battleStore.error)

const selectionStatus = computed(() => {
  if (!selectedPokemons.value.player1 && !selectedPokemons.value.player2) {
    return 'Selecione 2 Pokémon'
  }
  if (!selectedPokemons.value.player1 || !selectedPokemons.value.player2) {
    return 'Selecione 1 Pokémon'
  }
  return 'Seleção Completa'
})

const statusClass = computed(() => {
  if (selectedPokemons.value.player1 && selectedPokemons.value.player2) {
    return 'complete'
  }
  return 'incomplete'
})

const canStartBattle = computed(() => {
  return selectedPokemons.value.player1 && selectedPokemons.value.player2
})

// Methods
const getPokemonSprite = (pokemonName) => {
  const pokemonIds = {
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
    'mewtwo': 151, 'mew': 151
  }
  
  const normalizedName = pokemonName.toLowerCase().trim()
  const id = pokemonIds[normalizedName] || 25
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

const getPokemonId = (pokemonName) => {
  const pokemonIds = {
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
    'mewtwo': 151, 'mew': 151
  }
  
  const normalizedName = pokemonName.toLowerCase().trim()
  return pokemonIds[normalizedName] || 25
}

const getPokemonTypes = (pokemonName) => {
  const pokemonTypes = {
    'bulbasaur': ['grass', 'poison'], 'ivysaur': ['grass', 'poison'], 'venusaur': ['grass', 'poison'],
    'charmander': ['fire'], 'charmeleon': ['fire'], 'charizard': ['fire', 'flying'],
    'squirtle': ['water'], 'wartortle': ['water'], 'blastoise': ['water'],
    'pikachu': ['electric'], 'raichu': ['electric'],
    'eevee': ['normal'], 'vaporeon': ['water'], 'jolteon': ['electric'], 'flareon': ['fire'],
    'snorlax': ['normal'], 'dragonite': ['dragon', 'flying'],
    'mewtwo': ['psychic'], 'mew': ['psychic']
  }
  
  const normalizedName = pokemonName.toLowerCase().trim()
  return pokemonTypes[normalizedName] || ['normal']
}

const getTypeColor = (type) => {
  const typeColors = {
    'normal': '#A8A878', 'fire': '#F08030', 'water': '#6890F0',
    'electric': '#F8D030', 'grass': '#78C850', 'ice': '#98D8D8',
    'fighting': '#C03028', 'poison': '#A040A0', 'ground': '#E0C068',
    'flying': '#A890F0', 'psychic': '#F85888', 'bug': '#A8B820',
    'rock': '#B8A038', 'ghost': '#705898', 'dragon': '#7038F8',
    'dark': '#705848', 'steel': '#B8B8D0', 'fairy': '#EE99AC'
  }
  return typeColors[type] || '#68A090'
}

const selectPokemonForPlayer = async (playerId, pokemonName) => {
  try {
    await battleStore.selectPokemon(playerId, pokemonName)
  } catch (error) {
    console.error('Failed to select Pokemon:', error)
  }
}

const clearSelection = (playerId) => {
  if (playerId === 1) {
    battleStore.selectedPokemons.player1 = null
  } else {
    battleStore.selectedPokemons.player2 = null
  }
}

const resetSelection = () => {
  battleStore.selectedPokemons.player1 = null
  battleStore.selectedPokemons.player2 = null
}

const startBattle = async () => {
  try {
    await battleStore.startBattle()
    router.push('/battle')
  } catch (error) {
    console.error('Failed to start battle:', error)
  }
}

const goToBattle = () => {
  router.push('/battle')
}

// Lifecycle
onMounted(async () => {
  await battleStore.loadPokemonList()
  
  // Criar batalha automaticamente se não existir
  if (!battleStore.battle) {
    try {
      await battleStore.createBattle()
      console.log('✅ Batalha criada automaticamente na SelectionView')
    } catch (error) {
      console.error('❌ Erro ao criar batalha automática:', error)
    }
  }
})

const getPlayerPokemonData = (playerId) => {
  const pokemonName = playerId === 1 ? selectedPokemons.value.player1 : selectedPokemons.value.player2
  if (!pokemonName) return null
  
  const pokemonId = getPokemonId(pokemonName)
  const types = getPokemonTypes(pokemonName)
  
  return {
    id: pokemonId.toString(),
    name: pokemonName,
    level: 50,
    types: types,
    stats: {
      hp: 100,
      maxHp: 100,
      attack: 85,
      defense: 80,
      speed: 90
    },
    sprite: getPokemonSprite(pokemonName)
  }
}
</script>

<style scoped>
.selection-view {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
}

/* HEADER */
.selection-header {
  text-align: center;
  margin-bottom: 30px;
}

.selection-header h1 {
  margin-bottom: 16px;
  font-size: 2.5rem;
}

.header-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
}

.status-badge.complete {
  background: #38a169;
}

.status-badge.incomplete {
  background: #718096;
}

/* BUTTONS */
.primary-btn,
.secondary-btn,
.change-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.primary-btn {
  background: #3182ce;
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background: #2c5282;
  transform: translateY(-2px);
}

/* Animação de pulso quando pronto para batalhar */
.primary-btn.pulse-ready {
  animation: pulse-ready 1.5s infinite;
  background: #38a169;
  box-shadow: 0 0 20px rgba(56, 161, 105, 0.4);
}

.primary-btn.pulse-ready:hover {
  background: #2f855a;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 0 30px rgba(56, 161, 105, 0.6);
}

@keyframes pulse-ready {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(56, 161, 105, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(56, 161, 105, 0.6);
  }
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  background: #4a5568;
  color: white;
}

.secondary-btn:hover {
  background: #2d3748;
  transform: translateY(-2px);
}

.change-btn {
  background: #805ad5;
  color: white;
  margin-top: 10px;
}

.change-btn:hover {
  background: #6b46c1;
}

/* LOADING OVERLAY */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content h2 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.loading-content p {
  opacity: 0.8;
  font-size: 1rem;
}

/* MAIN SELECTION */
.main-selection {
  max-width: 1200px;
  margin: 0 auto 40px;
  text-align: center;
}

.main-selection h2 {
  margin-bottom: 10px;
  font-size: 2rem;
  color: white;
}

.selection-description {
  color: rgba(255,255,255,0.8);
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.players-selection {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

/* DESKTOP LAYOUT - Disposição lateral */
@media (min-width: 1024px) {
  .players-selection {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 60px;
  }
  
  .player-selection-section {
    width: 45%;
    max-width: 500px;
  }
  
  .vs-divider {
    align-self: center;
    margin: 0;
  }
}

.player-selection-section {
  width: 100%;
  max-width: 500px;
}

.player-selection-section h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: white;
}

.selected-card {
  margin-bottom: 20px;
}

.change-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.change-btn:hover {
  background: #4b5563;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  padding: 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  border: 2px dashed rgba(255,255,255,0.3);
  max-height: 400px;
  overflow-y: auto;
}

.pokemon-option {
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.pokemon-option:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  background: rgba(255,255,255,1);
}

.pokemon-option .pokemon-sprite {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}

.pokemon-option .pokemon-name {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  text-transform: capitalize;
}

/* VS */
.vs-divider {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.vs-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #d53f8c, #b83280);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* SELECTION CONTENT */
.selection-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.player-section {
  text-align: center;
}

.player-section h2 {
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.selected-pokemon-card {
  background: linear-gradient(135deg, #38a169, #2f855a);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  max-width: 300px;
  margin: 0 auto;
}

.selected-pokemon-card .pokemon-sprite {
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.selected-pokemon-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  text-transform: capitalize;
}

.selected-badge {
  display: inline-block;
  padding: 5px 15px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  border: 2px dashed rgba(255,255,255,0.3);
}

.pokemon-card {
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.pokemon-card:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  background: rgba(255,255,255,1);
}

.pokemon-card .pokemon-sprite {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}

.pokemon-card h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-transform: capitalize;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.type-badge {
  font-size: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
}

/* VS */
.vs-divider {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.vs-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #d53f8c, #b83280);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* ACTION BAR */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 32, 44, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.action-info p {
  margin: 0;
  font-weight: 600;
}

.action-info .warning {
  color: #f6ad55;
}

.action-info .ready {
  color: #68d391;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .main-selection {
    margin: 0 auto 20px;
  }
  
  .main-selection h2 {
    font-size: 1.5rem;
  }
  
  .selection-description {
    font-size: 1rem;
  }
  
  .players-selection {
    gap: 30px;
  }
  
  .player-selection-section {
    max-width: 100%;
  }
  
  .player-selection-section h3 {
    font-size: 1.3rem;
  }
  
  .selection-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 10px;
    padding: 15px;
    max-height: 300px;
  }
  
  .pokemon-option {
    padding: 10px;
  }
  
  .pokemon-option .pokemon-sprite {
    width: 50px;
    height: 50px;
  }
  
  .pokemon-option .pokemon-name {
    font-size: 10px;
  }
  
  .vs-circle {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }
  
  .action-bar {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }
  
  .action-buttons {
    justify-content: center;
  }
}

/* SCROLLBAR */
.pokemon-grid::-webkit-scrollbar {
  width: 8px;
}

.pokemon-grid::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}

.pokemon-grid::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
}

.pokemon-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.5);
}
</style>
