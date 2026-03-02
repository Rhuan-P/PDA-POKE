<template>
  <main class="battle-view">
    
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
        <PlayerArea :player-id="1" />

        <div class="battle-actions">
          <button
            class="attack-btn"
            :disabled="!isBattleActive || currentTurn !== 1 || !player1Ready"
            @click="executeAttack"
            title="Aguardando seu turno / selecione um Pokémon"
          >
            ⚔️ Atacar
          </button>
        </div>
      </article>

      <!-- VS -->
      <div class="vs-divider">
        <div class="vs-circle">VS</div>
      </div>

      <!-- PLAYER 2 -->
      <article class="arena-section" :class="{ 'turn-active': isBattleActive && currentTurn === 2 }">
        <h2>🔴 Jogador 2</h2>
        <PlayerArea :player-id="2" />

        <div class="battle-actions">
          <button
            class="attack-btn"
            :disabled="!isBattleActive || currentTurn !== 2 || !player2Ready"
            @click="executeAttack"
            title="Aguardando seu turno / selecione um Pokémon"
          >
            ⚔️ Atacar
          </button>
        </div>
      </article>

    </section>

    <!-- LOG -->
    <section class="battle-log">
      <h3>📜 Log da Batalha</h3>

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
        <h2>🏆 Resultado da Batalha</h2>

        <p v-if="winner">
          {{ winner.name }} venceu a batalha!
        </p>

        <p v-else>
          Houve empate!
        </p>

        <button class="primary-btn" @click="newBattle">
          Jogar Novamente
        </button>
      </div>
    </div>

  </main>
</template>

<script setup>
import { computed } from 'vue'
import PlayerArea from '../components/PlayerArea.vue'
import { useGameStore } from '../../state/gameStore.js'

const gameStore = useGameStore()

/* ==============================
   ESTADO REATIVO (UI consome Store)
============================== */

const battleStatus = computed(() => gameStore.battleStatus.value)
const battleLog = computed(() => gameStore.battleLog.value)
const winner = computed(() => gameStore.winner.value)
const showResultModal = computed(() => gameStore.showResultModal.value)
const canStartBattle = computed(() => gameStore.canStartBattle.value)
const isBattleActive = computed(() => gameStore.isBattleActive.value)
const currentTurn = computed(() => gameStore.currentTurn.value)

// Presença de Pokémon para habilitar ações
const player1Ready = computed(() => !!gameStore.player1.value && !!gameStore.player1.value.pokemon)
const player2Ready = computed(() => !!gameStore.player2.value && !!gameStore.player2.value.pokemon)

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

const startBattle = () => gameStore.startBattle()
const resetBattle = () => gameStore.resetBattle()
const hideResultModal = () => gameStore.hideResultModal()
const newBattle = () => gameStore.resetBattle()
const executeAttack = () => gameStore.executeTurn('attack')
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
}

.primary-btn {
  background: #3182ce;
  color: white;
}

.secondary-btn {
  background: #4a5568;
  color: white;
}

.attack-btn {
  background: #e53e3e;
  color: white;
  margin-top: 12px;
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

/* ARENA */
.battle-arena {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.arena-section {
  background: #2d3748;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
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
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  color: black;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 400px;
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