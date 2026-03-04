<template>
  <article class="arena-section" :class="{ 'turn-active': isBattleActive && currentTurn === playerId }">
    <h2>{{ playerIcon }} Jogador {{ playerId }}</h2>
    
    <PokemonCard 
      v-if="pokemonData" 
      :pokemon="pokemonData" 
      :justFainted="justFainted"
    />
    
    <div v-if="playerReady" class="battle-actions">

    </div>

    <!-- Seleção de Ataque -->
    <div v-if="isBattleActive && currentTurn === playerId" class="attack-selection">
      <h4>Escolha seu ataque:</h4>
      <div class="attack-buttons">
        <button 
          v-for="attack in availableAttacks"
          :key="attack.name"
          class="attack-btn-small"
          :data-attack-type="attack.type"
          @click="executeAttack(attack)"
          :disabled="loading"
        >
          {{ attack.name }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import PokemonCard from './PokemonCard.vue'

const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    validator: (value) => value === 1 || value === 2
  },
  pokemonData: {
    type: Object,
    default: null
  },
  playerReady: {
    type: Boolean,
    default: false
  },
  isBattleActive: {
    type: Boolean,
    default: false
  },
  currentTurn: {
    type: Number,
    default: 1
  },
  loading: {
    type: Boolean,
    default: false
  },
  justFainted: {
    type: Boolean,
    default: false
  },
  availableAttacks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['executeAttack'])

const playerIcon = computed(() => props.playerId === 1 ? '🔵' : '🔴')

const executeAttack = (attack) => {
  emit('executeAttack', attack)
}
</script>

<style scoped>
.arena-section {
  background: #2d3748;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.arena-section.turn-active {
  background: #4a5568;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  transform: scale(1.02);
}

.arena-section h2 {
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
}

.battle-actions {
  margin-top: 16px;
}

.attack-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 200px;
}

.attack-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.attack-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  gap: 8px;
  max-width: 300px;
  margin: 0 auto;
}

.attack-btn-small {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: capitalize;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.attack-btn-small::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.attack-btn-small:hover::before {
  left: 100%;
}

.attack-btn-small:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.attack-btn-small:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.attack-btn-small:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

/* Tipos de ataque com cores específicas */
.attack-btn-small[data-attack-type="fire"] {
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
  box-shadow: 0 4px 15px rgba(245, 101, 101, 0.3);
}

.attack-btn-small[data-attack-type="fire"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #e53e3e 0%, #b91c1c 100%);
  box-shadow: 0 8px 25px rgba(245, 101, 101, 0.4);
}

.attack-btn-small[data-attack-type="water"] {
  background: linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%);
  box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
}

.attack-btn-small[data-attack-type="water"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
}

.attack-btn-small[data-attack-type="grass"] {
  background: linear-gradient(135deg, #48bb78 0%, #2f855a 100%);
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
}

.attack-btn-small[data-attack-type="grass"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #38a169 0%, #276749 100%);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
}

.attack-btn-small[data-attack-type="electric"] {
  background: linear-gradient(135deg, #f6d55c 0%, #d69e2e 100%);
  box-shadow: 0 4px 15px rgba(246, 213, 92, 0.3);
}

.attack-btn-small[data-attack-type="electric"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #ecc94b 0%, #b7791f 100%);
  box-shadow: 0 8px 25px rgba(246, 213, 92, 0.4);
}

.attack-btn-small[data-attack-type="psychic"] {
  background: linear-gradient(135deg, #b794f4 0%, #805ad5 100%);
  box-shadow: 0 4px 15px rgba(183, 148, 244, 0.3);
}

.attack-btn-small[data-attack-type="psychic"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #9f7aea 0%, #6b46c1 100%);
  box-shadow: 0 8px 25px rgba(183, 148, 244, 0.4);
}

.attack-btn-small[data-attack-type="dragon"] {
  background: linear-gradient(135deg, #9f7aea 0%, #553c9a 100%);
  box-shadow: 0 4px 15px rgba(159, 122, 234, 0.3);
}

.attack-btn-small[data-attack-type="dragon"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #805ad5 0%, #44337a 100%);
  box-shadow: 0 8px 25px rgba(159, 122, 234, 0.4);
}

.attack-btn-small[data-attack-type="normal"] {
  background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
  box-shadow: 0 4px 15px rgba(160, 174, 192, 0.3);
}

.attack-btn-small[data-attack-type="normal"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
  box-shadow: 0 8px 25px rgba(160, 174, 192, 0.4);
}
</style>
