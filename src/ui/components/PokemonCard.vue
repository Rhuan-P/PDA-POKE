<!--
  Componente PokemonCard - Card visual do Pokémon
  Time UX: Implementar aqui a visualização do Pokémon
  Vue como biblioteca: usar apenas reatividade e renderização
  
  O que implementar:
  - Exibição de sprite e stats
  - Barras de HP e atributos
  - Indicadores de tipo
  - Estados visuais (derrotado, ativo, etc)
-->

<script setup>
import { computed } from 'vue';

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
});

// TODO: Time UX - Implementar lógica reativa do componente
const isDefeated = computed(() => {
  return props.pokemon?.stats?.hp <= 0;
});
</script>

<template>
  <div class="pokemon-card">
    <!-- TODO: Time UX - Implementar visualização do Pokémon -->
    <h3>{{ pokemon?.name || 'Pokémon' }}</h3>
    <div class="pokemon-image">
      <img v-if="pokemon?.sprite" :src="pokemon.sprite" :alt="pokemon.name" />
      <div v-else class="placeholder">?</div>
    </div>
    <div class="pokemon-stats">
      <!-- TODO: Implementar barras de HP, ATK, DEF, SPD -->
      <div>HP: {{ pokemon?.stats?.hp || 0 }}/{{ pokemon?.stats?.maxHp || 0 }}</div>
      <div>ATK: {{ pokemon?.stats?.attack || 0 }}</div>
      <div>DEF: {{ pokemon?.stats?.defense || 0 }}</div>
      <div>SPD: {{ pokemon?.stats?.speed || 0 }}</div>
    </div>
  </div>
</template>

<style scoped>
/* TODO: Time UX - Implementar estilos do card */
.pokemon-card {
  border: 2px solid #4a5568;
  border-radius: 12px;
  padding: 16px;
  background: #4a5568;
  color: white;
  text-align: center;
}

.pokemon-image {
  margin: 16px 0;
}

.pokemon-image img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.placeholder {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  font-weight: bold;
}

.pokemon-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 16px;
}
</style>
