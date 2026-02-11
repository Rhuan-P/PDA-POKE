<!--
  Componente BattleButton - Botão de ação
  Time UX: Implementar aqui botões reutilizáveis
  Vue como biblioteca: usar apenas reatividade e eventos
  
  O que implementar:
  - Estados visuais (primary, secondary, danger)
  - Loading e disabled
  - Animações e feedback visual
  - Acessibilidade
-->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

// TODO: Time UX - Implementar lógica reativa do botão
const buttonClass = computed(() => {
  return [
    'battle-button',
    `battle-button--${props.type}`,
    {
      'battle-button--disabled': props.disabled,
      'battle-button--loading': props.loading
    }
  ];
});

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click');
  }
};
</script>

<template>
  <button 
    :class="buttonClass" 
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading">⏳</span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<style scoped>
/* TODO: Time UX - Implementar estilos do botão */
.battle-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.battle-button:hover:not(.battle-button--disabled) {
  transform: translateY(-1px);
}

.battle-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.battle-button--secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.battle-button--danger {
  background: linear-gradient(135deg, #f85032 0%, #e73827 100%);
  color: white;
}

.battle-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.battle-button--loading {
  cursor: wait;
}
</style>
