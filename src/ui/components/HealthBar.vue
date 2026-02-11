<template>
  <div class="health-bar">
    <div class="health-bar__fill" :style="{ width: percent + '%' }"></div>
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
</script>

<style scoped>
.health-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 999px;
  overflow: hidden;
}

.health-bar__fill {
  height: 100%;
  background: #48bb78;
}
</style>
