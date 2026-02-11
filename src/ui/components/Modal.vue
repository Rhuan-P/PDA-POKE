<template>
  <div v-if="open" class="modal">
    <div class="modal__backdrop" @click="$emit('close')"></div>
    <div class="modal__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false }
});

defineEmits(['close']);
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.modal__content {
  position: relative;
  background: white;
  padding: 24px;
  border-radius: 12px;
  z-index: 1;
}
</style>
