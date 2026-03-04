<template>
  <main class="battle-view">
    
    <!-- HEADER -->
    <header class="battle-header">
      <div class="battle-info">
        <span class="status-badge" :class="statusClass">
          {{ battleStatus }}
        </span>

        <div class="header-controls">
          <button 
            class="secondary-btn"
            @click="resetBattle"
          >
            <i class="icon-reset"></i> Resetar
          </button>
        </div>

        <div v-if="isBattleActive" class="turn-indicator">
          <i class="icon-sword"></i> Turno: Jogador {{ currentTurn }}
        </div>
      </div>
    </header>

    <!-- ARENA -->
    <section class="battle-arena">
      <!-- PLAYER 1 -->
      <PlayerArena
        :player-id="1"
        :pokemon-data="player1PokemonData"
        :player-ready="player1Ready"
        :is-battle-active="isBattleActive"
        :current-turn="currentTurn"
        :loading="loading"
        :just-fainted="justFaintedPlayer1"
        :available-attacks="getAvailableAttacks(1)"
        @execute-attack="executeAttack"
      />

      <!-- VS -->
      <div class="vs-divider">
        <div class="vs-circle">VS</div>
      </div>

      <!-- PLAYER 2 -->
      <PlayerArena
        :player-id="2"
        :pokemon-data="player2PokemonData"
        :player-ready="player2Ready"
        :is-battle-active="isBattleActive"
        :current-turn="currentTurn"
        :loading="loading"
        :just-fainted="justFaintedPlayer2"
        :available-attacks="getAvailableAttacks(2)"
        @execute-attack="executeAttack"
      />
    </section>

    <!-- NO POKEMON SELECTED -->
    <div v-if="!player1Ready || !player2Ready" class="no-pokemon-overlay">
      <div class="no-pokemon-content">
        <h2><i class="icon-warning"></i> Pokémon não selecionados</h2>
        <p>Vá para a tela de seleção para escolher seus Pokémon!</p>
        <button class="primary-btn" @click="goToSelection">
          Selecionar Pokémon
        </button>
      </div>
    </div>

    <!-- LOG -->
    <section class="battle-log">
      <h3><i class="icon-book"></i> Log da Batalha</h3>

      <div class="log-content">
        <p
          v-for="(log, index) in reversedBattleLog"
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
        <div class="modal-header">
          <div class="trophy-icon"><i class="icon-trophy"></i></div>
          <h2>Batalha Finalizada!</h2>
        </div>

        <div class="modal-body">
          <div v-if="winner" class="winner-section">
            <div class="winner-announcement">
              <span class="winner-name">{{ winner.name }}</span>
              <span class="winner-text">venceu a batalha!</span>
            </div>
            <div class="winner-stats">
              <div class="stat-item">
                <span class="stat-label">HP Final:</span>
                <span class="stat-value">{{ getPlayerFinalHp(winner.name) }}</span>
              </div>
            </div>
          </div>

          <div v-else class="draw-section">
            <div class="draw-icon"><i class="icon-handshake"></i></div>
            <p class="draw-text">Houve empate!</p>
          </div>
        </div>

        <div class="modal-actions">
          <button class="secondary-btn" @click="goToSelection">
            <i class="icon-refresh"></i> Nova Seleção
          </button>
          <button class="primary-btn" @click="newBattle">
            <i class="icon-sword"></i> Jogar Novamente
          </button>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
import { computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBattleStore } from '../../stores/battleStore.js'
import PlayerArena from '../components/PlayerArena.vue'

const router = useRouter()
const battleStore = useBattleStore()

/* ==============================
   ESTADO REATIVO (UI consome Store)
============================== */

const battleStatus = computed(() => {
  if (!battleStore.battle) return 'Aguardando'
  if (battleStore.battle.status === 'waiting') return 'Aguardando seleção'
  if (battleStore.battle.status === 'active') return 'Em batalha'
  if (battleStore.battle.status === 'finished') return 'Finalizada'
  return 'Desconhecido'
})

const battleLog = computed(() => battleStore.battleLog || [])
const winner = computed(() => battleStore.battleWinner)
const showResultModal = computed(() => battleStore.showResultModal)
const isBattleActive = computed(() => battleStore.isBattleActive)
const currentTurn = computed(() => battleStore.currentTurn)
const loading = computed(() => battleStore.loading)
const justFaintedPlayer1 = computed(() => battleStore.justFaintedPlayer1)
const justFaintedPlayer2 = computed(() => battleStore.justFaintedPlayer2)

// Presença de Pokémon para habilitar ações
const player1Ready = computed(() => !!battleStore.selectedPokemons.player1)
const player2Ready = computed(() => !!battleStore.selectedPokemons.player2)

const player1PokemonData = computed(() => getPlayerPokemonData(1))
const player2PokemonData = computed(() => getPlayerPokemonData(2))

const reversedBattleLog = computed(() =>
  [...battleLog.value].reverse()
)

const statusClass = computed(() => {
  if (battleStatus.value === 'Em batalha') return 'active'
  if (battleStatus.value === 'Finalizada') return 'finished'
  return 'waiting'
})

/* ==============================
   MÉTODOS (delegação para Store)
============================== */

const resetBattle = () => battleStore.resetBattle()
const hideResultModal = () => battleStore.hideResultModal()
const newBattle = () => battleStore.resetBattle()
const executeAttack = (attack) => {
  const attackData = attack || { name: 'attack', type: 'normal', power: 50 }
  battleStore.executeTurn(currentTurn.value, attackData)
}

const getAvailableAttacks = (playerId) => {
  const pokemonName = playerId === 1 ? battleStore.selectedPokemons.player1 : battleStore.selectedPokemons.player2
  if (!pokemonName) return []
  
  // Mapeamento de ataques por Pokémon
  const pokemonAttacks = {
    'pikachu': [
      { name: 'Thunderbolt', type: 'electric', power: 90 },
      { name: 'Quick Attack', type: 'normal', power: 40 },
      { name: 'Thunder Wave', type: 'electric', power: 50 }
    ],
    'charizard': [
      { name: 'Flamethrower', type: 'fire', power: 90 },
      { name: 'Dragon Claw', type: 'dragon', power: 80 },
      { name: 'Fire Blast', type: 'fire', power: 110 }
    ],
    'blastoise': [
      { name: 'Hydro Pump', type: 'water', power: 110 },
      { name: 'Ice Beam', type: 'ice', power: 90 },
      { name: 'Water Gun', type: 'water', power: 40 }
    ],
    'bulbasaur': [
      { name: 'Razor Leaf', type: 'grass', power: 55 },
      { name: 'Vine Whip', type: 'grass', power: 45 },
      { name: 'Sleep Powder', type: 'grass', power: 50 }
    ],
    'squirtle': [
      { name: 'Water Gun', type: 'water', power: 40 },
      { name: 'Bubble', type: 'water', power: 20 },
      { name: 'Tackle', type: 'normal', power: 40 }
    ],
    'eevee': [
      { name: 'Tackle', type: 'normal', power: 40 },
      { name: 'Quick Attack', type: 'normal', power: 40 },
      { name: 'Bite', type: 'normal', power: 60 }
    ],
    'snorlax': [
      { name: 'Body Slam', type: 'normal', power: 85 },
      { name: 'Hyper Beam', type: 'normal', power: 150 },
      { name: 'Rest', type: 'normal', power: 0 }
    ],
    'dragonite': [
      { name: 'Dragon Claw', type: 'dragon', power: 80 },
      { name: 'Hyper Beam', type: 'normal', power: 150 },
      { name: 'Thunder Wave', type: 'electric', power: 50 }
    ],
    'mewtwo': [
      { name: 'Psychic', type: 'psychic', power: 90 },
      { name: 'Shadow Ball', type: 'ghost', power: 80 },
      { name: 'Recover', type: 'psychic', power: 0 }
    ]
  }
  
  const normalizedName = pokemonName.toLowerCase().trim()
  return pokemonAttacks[normalizedName] || [
    { name: 'Tackle', type: 'normal', power: 40 },
    { name: 'Quick Attack', type: 'normal', power: 40 }
  ]
}

const goToSelection = () => {
  router.push('/selection')
}

const getPlayerFinalHp = (pokemonName) => {
  if (battleStore.battle?.player1Data?.name === pokemonName) {
    return `${battleStore.battle.player1Data.currentHp}/${battleStore.battle.player1Data.stats.hp}`
  }
  if (battleStore.battle?.player2Data?.name === pokemonName) {
    return `${battleStore.battle.player2Data.currentHp}/${battleStore.battle.player2Data.stats.hp}`
  }
  return '0/0'
}

// Watcher para forçar atualização quando battle mudar
watch(
  () => battleStore.battle,
  (newBattle) => {
    console.log('DEBUG: Battle mudou, forçando re-renderização:', newBattle)
    // Forçar atualização reativa
    if (newBattle?.player1Data && newBattle?.player2Data) {
      console.log('DEBUG: Dados atualizados:', {
        player1Hp: newBattle.player1Data.currentHp,
        player2Hp: newBattle.player2Data.currentHp
      })
      
      // Forçar trigger de atualização manual
      setTimeout(() => {
        console.log('DEBUG: Forçando atualização manual dos dados')
        // Forçar re-renderização completa
        const event = new CustomEvent('forceUpdate', { detail: { timestamp: Date.now() } })
        window.dispatchEvent(event)
      }, 100)
    }
  },
  { deep: true }
)

// Watcher para forçar atualização quando justFainted mudar
watch(
  () => [battleStore.justFaintedPlayer1, battleStore.justFaintedPlayer2],
  ([newFainted1, newFainted2]) => {
    console.log('DEBUG: justFainted mudou:', { newFainted1, newFainted2 })
    
    // Forçar atualização imediata dos cards
    setTimeout(() => {
      console.log('DEBUG: Forçando atualização por desmaio')
      const event = new CustomEvent('faintedUpdate', { 
        detail: { 
          player1Fainted: newFainted1, 
          player2Fainted: newFainted2, 
          timestamp: Date.now() 
        } 
      })
      window.dispatchEvent(event)
    }, 50)
  },
  { immediate: true }
)

// Forçar atualização manual a cada 2 segundos
const forceUpdateInterval = setInterval(() => {
  if (battleStore.battle?.player1Data && battleStore.battle?.player2Data) {
    console.log('DEBUG: Forçando atualização periódica')
    console.log('🔍 DEBUG: Forçando atualização periódica')
    
    // Verificar se algum Pokémon tem HP <= 0 e forçar atualização
    const player1Hp = battleStore.battle.player1Data.currentHp
    const player2Hp = battleStore.battle.player2Data.currentHp
    const player1Fainted = battleStore.justFaintedPlayer1
    const player2Fainted = battleStore.justFaintedPlayer2
    
    if (player1Hp <= 0 || player1Fainted) {
      console.log('🔍 DEBUG: Forçando atualização Player 1 (HP: ' + player1Hp + ', Fainted: ' + player1Fainted + ')')
      const event = new CustomEvent('criticalUpdate', { 
        detail: { 
          playerId: 1, 
          hp: player1Hp,
          fainted: player1Fainted,
          timestamp: Date.now() 
        } 
      })
      window.dispatchEvent(event)
    }
    
    if (player2Hp <= 0 || player2Fainted) {
      console.log('🔍 DEBUG: Forçando atualização Player 2 (HP: ' + player2Hp + ', Fainted: ' + player2Fainted + ')')
      const event = new CustomEvent('criticalUpdate', { 
        detail: { 
          playerId: 2, 
          hp: player2Hp,
          fainted: player2Fainted,
          timestamp: Date.now() 
        } 
      })
      window.dispatchEvent(event)
    }
    
    const event = new CustomEvent('forceUpdate', { detail: { timestamp: Date.now() } })
    window.dispatchEvent(event)
  }
}, 500)

// Limpar interval quando o componente for desmontado
onUnmounted(() => {
  console.log('🔍 DEBUG: Limpando forceUpdateInterval')
  clearInterval(forceUpdateInterval)
})

const getPlayerPokemonData = (playerId) => {
  const pokemonName = playerId === 1 ? battleStore.selectedPokemons.player1 : battleStore.selectedPokemons.player2
  if (!pokemonName) return null
  
  console.log(`🔍 DEBUG: getPlayerPokemonData(${playerId})`)
  console.log(`🔍 DEBUG: battleStore.battle:`, battleStore.battle)
  console.log(`🔍 DEBUG: battleStore.battle?.player1Data:`, battleStore.battle?.player1Data)
  console.log(`🔍 DEBUG: battleStore.battle?.player2Data:`, battleStore.battle?.player2Data)
  
  // Verificar se temos dados completos do battle
  if (battleStore.battle?.player1Data && battleStore.battle?.player2Data) {
    const playerData = playerId === 1 ? battleStore.battle.player1Data : battleStore.battle.player2Data
    console.log(`🔍 DEBUG: Usando dados do battle para ${playerId}:`, {
      name: playerData.name,
      hp: playerData.currentHp,
      maxHp: playerData.stats.hp,
      justFainted: playerId === 1 ? battleStore.justFaintedPlayer1 : battleStore.justFaintedPlayer2
    })
    
    // Forçar atualização reativa do Vue
    const pokemonData = {
      id: playerData.id.toString(),
      name: playerData.name,
      level: 50,
      types: playerData.types,
      stats: {
        hp: playerData.currentHp,
        maxHp: playerData.stats.hp,
        attack: playerData.stats.attack,
        defense: playerData.stats.defense,
        speed: playerData.stats.speed
      },
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${playerData.id}.png`
    }
    
    // Forçar trigger de atualização para garantir reatividade
    setTimeout(() => {
      console.log(`🔍 DEBUG: Forçando atualização reativa para ${playerId}`)
      const event = new CustomEvent('pokemonUpdate', { 
        detail: { playerId, data: pokemonData, timestamp: Date.now() } 
      })
      window.dispatchEvent(event)
    }, 50)
    
    return pokemonData
  }
  
  console.log(`🔍 DEBUG: Usando dados estáticos para ${playerId}: ${pokemonName}`)
  
  // FALLBACK: Mapeamento de IDs para sprites
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
  
  // Mapeamento de tipos
  const pokemonTypes = {
    'bulbasaur': ['grass', 'poison'], 'ivysaur': ['grass', 'poison'], 'venusaur': ['grass', 'poison'],
    'charmander': ['fire'], 'charmeleon': ['fire'], 'charizard': ['fire', 'flying'],
    'squirtle': ['water'], 'wartortle': ['water'], 'blastoise': ['water'],
    'pikachu': ['electric'], 'raichu': ['electric'],
    'eevee': ['normal'], 'vaporeon': ['water'], 'jolteon': ['electric'], 'flareon': ['fire'],
    'snorlax': ['normal'], 'dragonite': ['dragon', 'flying'],
    'mewtwo': ['psychic'], 'mew': ['psychic']
  }
  
  const types = pokemonTypes[normalizedName] || ['normal']
  
  // Dados estáticos com HP inicial
  const staticData = {
    id: id.toString(),
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
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  }
  
  console.log(`🔍 DEBUG: Retornando dados estáticos para ${playerId}:`, staticData)
  return staticData
}

</script>

<style scoped>

/* MOBILE FIRST */

.battle-view {
  padding: 16px;
  background: #1a202c;
  min-height: 100vh;
  color: white;
}

/* HEADER */
.battle-header {
  text-align: center;
  margin-bottom: 24px;
}

.battle-header h1 {
  margin-bottom: 16px;
}

.battle-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.status-badge {
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: bold;
}

.status-badge.active {
  background: #38a169;
}

.status-badge.finished {
  background: #e53e3e;
}

.status-badge.waiting {
  background: #718096;
}

/* BUTTONS */
.primary-btn,
.secondary-btn,
.attack-btn {
  padding: 8px 14px;
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

.primary-btn:hover {
  background: #2c5282;
  transform: translateY(-2px);
}

.secondary-btn {
  background: #4a5568;
  color: white;
}

.secondary-btn:hover {
  background: #2d3748;
  transform: translateY(-2px);
}

.attack-btn {
  background: #e53e3e;
  color: white;
  margin-top: 12px;
}

.attack-btn:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-2px);
}

/* visual for disabled attack */
.attack-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* highlight active player's area */
.arena-section.turn-active {
  box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
  border: 2px solid #6366f1;
}

.turn-indicator {
  margin-top: 8px;
  font-weight: 600;
  color: #cbd5e1;
}

/* POKEMON CARD CONTAINER */
.pokemon-card-container {
  margin-bottom: 20px;
}

.attack-selection {
  margin-top: 20px;
  text-align: center;
  padding: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.attack-selection h4 {
  margin-bottom: 15px;
  color: #f1f5f9;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.attack-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 300px;
  margin: 0 auto;
}

.arena-section {
  background: #2d3748;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.battle-arena {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.vs-divider {
  display: flex;
  justify-content: center;
}

.vs-circle {
  width: 60px;
  height: 60px;
  background: #d53f8c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* NO POKEMON OVERLAY */
.no-pokemon-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.no-pokemon-content {
  background: white;
  color: black;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
}

.no-pokemon-content h2 {
  margin-bottom: 16px;
  color: #e53e3e;
}

.no-pokemon-content p {
  margin-bottom: 24px;
  color: #4a5568;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* LOG */
.battle-log {
  margin-top: 24px;
  background: #2d3748;
  padding: 16px;
  border-radius: 12px;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
}

.log-entry {
  font-family: monospace;
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.log-empty {
  opacity: 0.7;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  border: 2px solid rgba(255,255,255,0.1);
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  margin-bottom: 24px;
}

.trophy-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.modal-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.modal-body {
  margin-bottom: 32px;
}

.winner-section {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.winner-announcement {
  margin-bottom: 20px;
}

.winner-name {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  text-transform: capitalize;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.winner-text {
  font-size: 1.1rem;
  opacity: 0.9;
}

.winner-stats {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.2);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.stat-label {
  font-weight: 600;
  opacity: 0.8;
}

.stat-value {
  font-weight: 700;
  color: #ffd700;
  font-size: 1.1rem;
}

.draw-section {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.draw-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.draw-text {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  opacity: 0.9;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.modal-actions button {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 140px;
}

.modal-actions .primary-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #1a202c;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.modal-actions .primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.modal-actions .secondary-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}

.modal-actions .secondary-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

/* DESKTOP */
@media (min-width: 768px) {
  .battle-arena {
    flex-direction: row;
    justify-content: space-between;
  }

  .arena-section {
    width: 40%;
  }

  .vs-divider {
    align-items: center;
  }
}
</style>