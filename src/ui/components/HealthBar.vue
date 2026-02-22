<!--
  HealthBar.vue - Barra de HP com cor dinâmica
  Muda de cor conforme o HP cai: verde > amarelo > vermelho
-->

<template>
  <div class="health-bar-wrapper">
    <div class="health-bar">
      <div
        class="health-bar__fill"
        :style="{
          width: percent + '%',
          backgroundColor: barColor,
        }"
      />
    </div>
    <span class="health-bar__text">{{ current }} / {{ max }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  current: { type: Number, required: true },
  max: { type: Number, required: true }
});

const percent = computed(() => {
  if (props.max <= 0) return 0;
  return Math.max(0, Math.min(100, (props.current / props.max) * 100));
});

const barColor = computed(() => {
  if (percent.value > 50) return '#48bb78';
  if (percent.value > 25) return '#ecc94b';
  return '#f56565';
});
</script>

<style scoped>
.health-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.health-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 999px;
  overflow: hidden;
}

.health-bar__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease, background-color 0.4s ease;
}

.health-bar__text {
  font-size: 0.7rem;
  color: #94a3b8;
  text-align: right;
}
</style>