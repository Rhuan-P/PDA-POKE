<!--
  View BattleView - View principal da batalha
  Time UX: Implementar aqui a tela principal
  Vue como biblioteca: usar apenas reatividade e composição
  
  O que implementar:
  - Layout da arena de batalha
  - Orquestração dos componentes
  - Estado global da aplicação
  - Modal de resultados
-->
<template>
  <div class="battle-view">
    <!-- Header com informações e controles -->
    <div class="battle-header">
      <h1>⚔️ Pokémon Battle Simulator</h1>
      <div class="battle-info">
        <span class="status-badge">{{ battleStatus }}</span>
        <a href="/docs/README.md" target="_blank" class="docs-link">📚 Ver Documentação</a>
      </div>
      <div class="battle-controls">
        <BattleButton 
          v-if="canStartBattle"
          text="Iniciar Batalha"
          type="success"
          @click="startBattle"
        />
        <BattleButton 
          text="Resetar"
          type="danger"
          @click="resetBattle"
        />
      </div>
    </div>

    <!-- Área de batalha com os dois jogadores -->
    <div class="battle-arena">
      <div class="arena-section">
        <h3>🔵 Jogador 1</h3>
        <PlayerArea :player-id="1" />
        <!-- Botões de ataque para Jogador 1 -->
        <div v-if="isBattleActive && currentTurn === 1" class="battle-actions">
          <h4>🎯 Ações do Jogador 1</h4>
          <BattleButton 
            text="⚔️ Atacar"
            type="danger"
            @click="executeAttack"
          />
        </div>
      </div>
      
      <div class="vs-divider">
        <div class="vs-circle">VS</div>
      </div>
      
      <div class="arena-section">
        <h3>🔴 Jogador 2</h3>
        <PlayerArea :player-id="2" />
        <!-- Botões de ataque para Jogador 2 -->
        <div v-if="isBattleActive && currentTurn === 2" class="battle-actions">
          <h4>🎯 Ações do Jogador 2</h4>
          <BattleButton 
            text="⚔️ Atacar"
            type="danger"
            @click="executeAttack"
          />
        </div>
      </div>
    </div>

    <!-- Log da batalha -->
    <div class="battle-log">
      <h3>📜 Log da Batalha</h3>
      <div class="log-content">
        <div 
          v-for="(log, index) in battleLog.slice().reverse()"
          :key="index"
          class="log-entry"
        >
          {{ log }}
        </div>
        <div v-if="battleLog.length === 0" class="log-empty">
          <p>📝 Nenhuma ação registrada ainda</p>
          <p class="log-hint">Time UX: Implemente o sistema de logging em gameStore.js</p>
        </div>
      </div>
    </div>

    <!-- Modal de resultado -->
    <div v-if="showResultModal" class="modal-overlay" @click="hideResultModal">
      <div class="modal-content" @click.stop>
        <div class="result-header">
          <h2>🏆 Batalha Finalizada!</h2>
        </div>
        <div class="result-body">
          <div class="winner-info">
            <h3>{{ winner?.name || 'Desconhecido' }}</h3>
            <p>Venceu a batalha!</p>
          </div>
        </div>
        <div class="result-actions">
          <BattleButton 
            text="Nova Batalha"
            type="success"
            @click="newBattle"
          />
          <BattleButton 
            text="Fechar"
            type="secondary"
            @click="hideResultModal"
          />
        </div>
      </div>
    </div>

    <!-- Cards de orientação para as equipes -->
    <div class="team-guides">
      <div class="guide-card game-logic">
        <h4>🎮 Time Game Logic</h4>
        <p>Implemente em <code>src/domain/</code>:</p>
        <ul>
          <li>Entidades Pokémon em <code>entities/Pokemon.ts</code></li>
          <li>Cálculos de stats em <code>utils/StatCalculator.ts</code></li>
          <li>Serviços de batalha em <code>services/battleService.ts</code></li>
        </ul>
        <a href="/backlog/backlog-squad-a.md" target="_blank">Ver Backlog →</a>
      </div>
      
      <div class="guide-card ux">
        <h4>🎨 Time UX</h4>
        <p>Implemente em <code>src/services/</code>, <code>src/state/</code>, <code>src/ui/</code>:</p>
        <ul>
          <li>APIs em <code>services/pokeApiService.js</code></li>
          <li>Estado em <code>state/gameStore.js</code></li>
          <li>Componentes em <code>ui/components/</code></li>
        </ul>
        <a href="/backlog/backlog-squad-b.md" target="_blank">Ver Backlog →</a>
      </div>
      
      <div class="guide-card devops">
        <h4>⚙️ DevOps</h4>
        <p>Mantenha estrutura e qualidade:</p>
        <ul>
          <li>Configuração em <code>package.json</code></li>
          <li>Pipelines em <code>.github/workflows/</code></li>
          <li>Documentação em <code>docs/</code></li>
        </ul>
        <a href="/backlog/backlog-devops.md" target="_blank">Ver Backlog →</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue';
import PlayerArea from '../components/PlayerArea.vue';
import BattleButton from '../components/BattleButton.vue';
import { useGameStore } from '../../state/gameStore.js';

// Inicializar o store corretamente
const gameStore = useGameStore();

// TODO: Time UX - Implementar estado reativo da view
const battleStatus = computed(() => {
  console.log('🔍 battleStatus:', gameStore.battleStatus);
  return gameStore.battleStatus;
});
const battleLog = computed(() => gameStore.battleLog);
const winner = computed(() => gameStore.winner);
const showResultModal = computed(() => gameStore.showResultModal);
const canStartBattle = computed(() => {
  console.log('🔍 canStartBattle:', gameStore.canStartBattle);
  console.log('🔍 player1:', gameStore.player1);
  console.log('🔍 player2:', gameStore.player2);
  return gameStore.canStartBattle;
});
const isBattleActive = computed(() => gameStore.isBattleActive);
const currentTurn = computed(() => gameStore.currentTurn);

// TODO: Time UX - Implementar métodos da view
const startBattle = () => {
  console.log('⚔️ Iniciando batalha...');
  gameStore.startBattle();
};

const resetBattle = () => {
  console.log('🔄 Resetando batalha...');
  gameStore.resetBattle();
  
  // Forçar atualização após o reset
  nextTick(() => {
    console.log('🔄 Após nextTick - canStartBattle:', gameStore.canStartBattle);
    console.log('🔄 Após nextTick - player1:', gameStore.player1);
    console.log('🔄 Após nextTick - player2:', gameStore.player2);
  });
};

const hideResultModal = () => {
  gameStore.hideResultModal();
};

const newBattle = () => {
  console.log('🆕 Iniciando nova batalha...');
  gameStore.resetBattle();
};

const executeAttack = () => {
  console.log('⚔️ Executando ataque...');
  gameStore.executeTurn('attack');
};
</script>

<style scoped>
/* TODO: Time UX - Implementar estilos da view */
.battle-view {
  min-height: 100vh;
  padding: 20px;
  background: #718096;
}

.battle-header {
  text-align: center;
  margin-bottom: 30px;
}

.battle-header h1 {
  color: white;
  margin: 0 0 20px 0;
  font-size: 2.5em;
}

.battle-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.status-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

.docs-link {
  color: white;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.docs-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.battle-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.battle-actions {
  margin-top: 20px;
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.battle-actions h4 {
  color: white;
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.battle-arena {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 30px;
  margin-bottom: 30px;
  align-items: start;
}

.arena-section {
  text-align: center;
}

.arena-section h3 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.vs-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.vs-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.battle-log {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.battle-log h3 {
  color: white;
  margin-bottom: 15px;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
}

.log-entry {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9em;
}

.log-empty {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 20px;
}

.log-hint {
  font-size: 0.85em;
  margin-top: 10px;
  opacity: 0.8;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.result-header h2 {
  margin: 0 0 20px 0;
  color: #2d3748;
}

.result-body {
  margin-bottom: 20px;
}

.winner-info h3 {
  margin: 0 0 10px 0;
  color: #2d3748;
}

.winner-info p {
  margin: 0;
  color: #718096;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Team guide cards */
.team-guides {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.guide-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.guide-card h4 {
  margin: 0 0 15px 0;
  font-size: 1.2em;
}

.guide-card.game-logic h4 {
  color: #e53e3e;
}

.guide-card.ux h4 {
  color: #3182ce;
}

.guide-card.devops h4 {
  color: #38a169;
}

.guide-card p {
  margin: 0 0 10px 0;
  color: #4a5568;
}

.guide-card ul {
  margin: 0 0 15px 0;
  padding-left: 20px;
  color: #4a5568;
}

.guide-card li {
  margin-bottom: 5px;
}

.guide-card code {
  background: #f7fafc;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
  color: #2d3748;
}

.guide-card a {
  color: #3182ce;
  text-decoration: none;
  font-weight: 600;
}

.guide-card a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .battle-arena {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .vs-divider {
    order: -1;
    margin-bottom: 20px;
  }
  
  .team-guides {
    grid-template-columns: 1fr;
  }
  
  .battle-header h1 {
    font-size: 2em;
  }
}
</style>
