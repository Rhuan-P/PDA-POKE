<!--
  BattleInviteModal - Modal de convite de batalha multiplayer
  DevOps Squad - Webhook Battle System
  
  Componente responsável por exibir o modal de convite de batalha
  com link para compartilhamento e status da sala.
-->
<template>
  <div class="battle-invite-modal" v-if="show" @click.self="handleOverlayClick">
    <div class="modal-overlay"></div>
    <div class="modal-content" :class="{ 'shake': shakeAnimation }">
      <!-- Header -->
      <div class="modal-header">
        <h3>🎮 Convite de Batalha Pokémon</h3>
        <button class="close-btn" @click="close" aria-label="Fechar">
          ✕
        </button>
      </div>

      <!-- Status Section -->
      <div class="status-section">
        <div class="status-grid">
          <div class="status-item">
            <span class="status-label">Código:</span>
            <span class="status-value code">{{ inviteCode }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Expira em:</span>
            <span class="status-value" :class="{ 'warning': timeRemaining < 300 }">
              {{ formatTime(expiresAt) }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">Jogadores:</span>
            <span class="status-value">
              <span class="player-count">{{ playerCount }}</span>/2
              <span class="player-indicator" :class="{ 'complete': playerCount === 2 }">
                {{ playerCount === 2 ? '✅' : '⏳' }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Invite Link Section -->
      <div class="invite-section">
        <h4>📤 Compartilhe este link:</h4>
        <div class="invite-link-container">
          <input 
            ref="linkInput" 
            :value="inviteLink" 
            readonly 
            class="invite-link-input"
            @click="selectLink"
          />
          <button 
            @click="copyLink" 
            class="copy-btn"
            :class="{ 'copied': copySuccess }"
            :disabled="copying"
          >
            <span v-if="!copySuccess">📋 Copiar</span>
            <span v-else>✅ Copiado!</span>
          </button>
        </div>
        <p class="invite-hint">
          Envie este link para seu amigo para começar a batalha!
        </p>
      </div>

      <!-- Players Section -->
      <div class="players-section" v-if="players.length > 0">
        <h4>👥 Jogadores na Batalha:</h4>
        <div class="players-list">
          <div 
            v-for="player in players" 
            :key="player.id"
            class="player-item"
            :class="{ 'ready': player.ready }"
          >
            <div class="player-avatar">
              <img :src="player.pokemonSprite" :alt="player.pokemonName" />
              <div class="player-badge">{{ player.position === 1 ? '🔵' : '🔴' }}</div>
            </div>
            <div class="player-info">
              <span class="player-name">{{ player.pokemonName }}</span>
              <span class="player-status">
                {{ player.ready ? '✅ Pronto' : '⏳ Aguardando...' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="actions-section">
        <div class="actions-row">
          <button @click="close" class="btn btn-secondary">
            Cancelar
          </button>
          <button 
            @click="goToBattle" 
            class="btn btn-primary"
            :disabled="!canStartBattle"
            :class="{ 'pulse': canStartBattle }"
          >
            <span v-if="playerCount < 2">⏳ Aguardando oponente...</span>
            <span v-else>⚔️ Começar Batalha!</span>
          </button>
        </div>
        
        <!-- Additional Actions -->
        <div class="secondary-actions" v-if="playerCount === 2">
          <button @click="refreshStatus" class="btn btn-outline" :disabled="refreshing">
            🔄 Atualizar Status
          </button>
          <button @click="cancelInvite" class="btn btn-danger-outline">
            ❌ Cancelar Convite
          </button>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div class="loading-overlay" v-if="loading">
        <div class="loading-spinner"></div>
        <span>Processando...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  inviteCode: String,
  inviteLink: String,
  players: {
    type: Array,
    default: () => []
  },
  expiresAt: String,
  loading: Boolean
});

const emit = defineEmits(['close', 'battle-ready', 'refresh-status', 'cancel-invite']);

// Refs
const linkInput = ref(null);
const copySuccess = ref(false);
const copying = ref(false);
const shakeAnimation = ref(false);
const refreshing = ref(false);

// Computed
const playerCount = computed(() => props.players.length);
const canStartBattle = computed(() => playerCount.value === 2 && props.players.every(p => p.ready));
const timeRemaining = computed(() => {
  if (!props.expiresAt) return Infinity;
  const now = new Date();
  const expires = new Date(props.expiresAt);
  return expires.getTime() - now.getTime();
});

// Methods
const close = () => {
  emit('close');
};

const handleOverlayClick = () => {
  close();
};

const selectLink = () => {
  if (linkInput.value) {
    linkInput.value.select();
    linkInput.value.setSelectionRange(0, 99999); // For mobile
  }
};

const copyLink = async () => {
  try {
    copying.value = true;
    selectLink();
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.inviteLink);
    } else {
      // Fallback for older browsers
      document.execCommand('copy');
    }
    
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro ao copiar link:', error);
    // Show error feedback
    shakeAnimation.value = true;
    setTimeout(() => {
      shakeAnimation.value = false;
    }, 500);
  } finally {
    copying.value = false;
  }
};

const goToBattle = () => {
  if (canStartBattle.value) {
    emit('battle-ready');
  }
};

const refreshStatus = async () => {
  try {
    refreshing.value = true;
    emit('refresh-status');
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error);
  } finally {
    refreshing.value = false;
  }
};

const cancelInvite = () => {
  if (confirm('Tem certeza que deseja cancelar este convite?')) {
    emit('cancel-invite');
  }
};

const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  
  const now = new Date();
  const expires = new Date(dateString);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expirado';
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${seconds}s`;
  }
};

// Auto-refresh countdown
let countdownInterval = null;

const startCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = setInterval(() => {
    if (timeRemaining.value <= 0) {
      clearInterval(countdownInterval);
      emit('close'); // Auto-close when expired
    }
  }, 1000);
};

const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

// Watch for show/hide
watch(() => props.show, (newValue) => {
  if (newValue) {
    startCountdown();
    // Auto-select link when modal opens
    nextTick(() => {
      selectLink();
    });
  } else {
    stopCountdown();
    copySuccess.value = false;
  }
});

// Cleanup
onUnmounted(() => {
  stopCountdown();
});

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (!props.show) return;
  
  switch (event.key) {
    case 'Escape':
      close();
      break;
    case 'Enter':
      if (canStartBattle.value) {
        goToBattle();
      }
      break;
    case 'c':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        copyLink();
      }
      break;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.battle-invite-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSlideIn 0.3s ease-out;
}

.modal-content.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.status-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.status-grid {
  display: grid;
  gap: 12px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-weight: 500;
  color: #6b7280;
}

.status-value {
  font-weight: 600;
  color: #1f2937;
}

.status-value.code {
  font-family: 'Courier New', monospace;
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.status-value.warning {
  color: #f59e0b;
}

.player-count {
  font-weight: 700;
  color: #059669;
}

.player-indicator.complete {
  color: #059669;
}

.invite-section {
  margin-bottom: 20px;
}

.invite-section h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
}

.invite-link-container {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.invite-link-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  background: #f9fafb;
  transition: border-color 0.2s;
}

.invite-link-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.copy-btn {
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.copy-btn:hover:not(:disabled) {
  background: #2563eb;
}

.copy-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.copy-btn.copied {
  background: #059669;
}

.invite-hint {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.players-section {
  margin-bottom: 20px;
}

.players-section h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.player-item.ready {
  border-color: #059669;
  background: #ecfdf5;
}

.player-avatar {
  position: relative;
  width: 48px;
  height: 48px;
}

.player-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.player-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  border: 2px solid #e5e7eb;
}

.player-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.player-name {
  font-weight: 600;
  color: #1f2937;
}

.player-status {
  font-size: 0.875rem;
  color: #6b7280;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions-row {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #059669;
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background: #047857;
}

.btn-primary.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-danger-outline {
  background: transparent;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.btn-danger-outline:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #dc2626;
}

.secondary-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 640px) {
  .modal-content {
    padding: 20px;
    margin: 10px;
  }
  
  .actions-row {
    flex-direction: column;
  }
  
  .secondary-actions {
    flex-direction: column;
  }
  
  .invite-link-container {
    flex-direction: column;
  }
  
  .copy-btn {
    width: 100%;
  }
}
</style>
