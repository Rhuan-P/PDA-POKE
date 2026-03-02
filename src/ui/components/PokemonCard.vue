<!--
  PokemonCard.vue - Card visual do Pokémon
  Exibe sprite, barra de HP com cor dinâmica, tipos e stats básicos
-->

<script setup>
import { computed } from 'vue';

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
});

// calcula % de hp pra mudar a cor da barra
const hpPercent = computed(() => {
  const hp = props.pokemon?.stats?.hp ?? 0;
  const max = props.pokemon?.stats?.maxHp ?? 1;
  return Math.max(0, Math.min(100, (hp / max) * 100));
});

// verde > amarelo > vermelho dependendo do hp
const hpBarColor = computed(() => {
  if (hpPercent.value > 50) return '#48bb78';
  if (hpPercent.value > 25) return '#ecc94b';
  return '#f56565';
});

const isDefeated = computed(() => {
  return (props.pokemon?.stats?.hp ?? 1) <= 0;
});

// cores por tipo de pokemon
const typeColors = {
  fire: '#f6a042',
  water: '#4a9fe8',
  grass: '#5dbf6e',
  electric: '#f5d020',
  poison: '#a855f7',
  flying: '#82b4f5',
  normal: '#a8a77a',
  psychic: '#f95587',
  ice: '#96d9d6',
  dragon: '#6f35fc',
  dark: '#705746',
  steel: '#b7b7ce',
  fairy: '#d685ad',
  fighting: '#c22e28',
  rock: '#b6a136',
  ground: '#e2bf65',
  bug: '#a6b91a',
  ghost: '#735797',
};

const getTypeColor = (type) => typeColors[type] ?? '#888';
</script>

<template>
  <div class="poke-card" :class="{ defeated: isDefeated }">

    <!-- nome + level -->
    <div class="card-header">
      <span class="poke-name">{{ pokemon?.name ?? 'Pokémon' }}</span>
      <span class="poke-level">Lv {{ pokemon?.level ?? 50 }}</span>
    </div>

    <!-- tipos -->
    <div class="types-row" v-if="pokemon?.types?.length">
      <span
        v-for="type in pokemon.types"
        :key="type"
        class="type-badge"
        :style="{ backgroundColor: getTypeColor(type) }"
      >
        {{ type }}
      </span>
    </div>

    <!-- sprite -->
    <div class="sprite-area">
      <img
        v-if="pokemon?.sprite"
        :src="pokemon.sprite"
        :alt="pokemon.name"
        class="sprite"
        :class="{ 'sprite-fainted': isDefeated }"
      />
      <div v-else class="sprite-placeholder">?</div>

      <div v-if="isDefeated" class="fainted-label">Desmaiou</div>
    </div>

    <!-- barra de hp -->
    <div class="hp-section">
      <div class="hp-label">
        <span>HP</span>
        <span>{{ pokemon?.stats?.hp ?? 0 }} / {{ pokemon?.stats?.maxHp ?? 0 }}</span>
      </div>
      <div class="hp-track">
        <div
          class="hp-fill"
          :style="{
            width: hpPercent + '%',
            backgroundColor: hpBarColor,
          }"
        />
      </div>
    </div>

    <!-- stats -->
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">ATK</span>
        <span class="stat-value">{{ pokemon?.stats?.attack ?? 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">DEF</span>
        <span class="stat-value">{{ pokemon?.stats?.defense ?? 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">SPD</span>
        <span class="stat-value">{{ pokemon?.stats?.speed ?? 0 }}</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.poke-card {
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 16px;
  padding: 16px;
  color: #f1f5f9;
  width: 100%;
  max-width: 220px;
  margin: 0 auto;
  transition: border-color 0.2s;
}

.poke-card.defeated {
  border-color: #ef4444;
  opacity: 0.7;
}

/* header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.poke-name {
  font-weight: 700;
  font-size: 1rem;
  text-transform: capitalize;
}

.poke-level {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* tipos */
.types-row {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.type-badge {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* sprite */
.sprite-area {
  position: relative;
  text-align: center;
  margin-bottom: 14px;
}

.sprite {
  width: 110px;
  height: 110px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
  transition: filter 0.3s;
}

.sprite-fainted {
  filter: grayscale(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.sprite-placeholder {
  width: 110px;
  height: 110px;
  background: #334155;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto;
  color: #64748b;
}

.fainted-label {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
  letter-spacing: 0.05em;
}

/* barra de hp */
.hp-section {
  margin-bottom: 14px;
}

.hp-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.hp-track {
  background: #334155;
  border-radius: 999px;
  height: 8px;
  overflow: hidden;
}

.hp-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease, background-color 0.4s ease;
}

/* stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.stat-item {
  background: #0f172a;
  border-radius: 8px;
  padding: 6px 4px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.stat-value {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-top: 2px;
}
</style>