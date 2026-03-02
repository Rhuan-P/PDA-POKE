<!--
  Componente PlayerArea - Área do jogador
  Time UX: Seleção simples e direta de Pokémon
  Vue como biblioteca: usar apenas reatividade e renderização
  
  O que implementar:
  - Lista de Pokémon fixos
  - Seleção por clique
  - Exibição do card quando selecionado
  - Estados visuais simples
-->
<script setup>
import { computed } from 'vue';
import PokemonCard from './PokemonCard.vue';
import BattleButton from './BattleButton.vue';
import { useGameStore } from '../../state/gameStore.js';

const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    validator: (value) => [1, 2].includes(value)
  }
});

// Lista fixa de Pokémon para teste (remover/isolar em DEV depois)
const availablePokemon = [
  { id: 25, name: 'Pikachu', types: ['electric'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
  { id: 6, name: 'Charizard', types: ['fire', 'flying'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
  { id: 1, name: 'Bulbasaur', types: ['grass', 'poison'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
  { id: 7, name: 'Squirtle', types: ['water'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
  { id: 133, name: 'Eevee', types: ['normal'], sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png' }
];

const gameStore = useGameStore();

// Selected pokemon is consumed directly from the store (UI reads state only)
// alias the computed value so template can reference it simply as `pokemon`
const pokemon = computed(() => {
  return props.playerId === 1 ? gameStore.player1.pokemon : gameStore.player2.pokemon;
});

const selectPokemon = (selected) => {
  const pokemonData = {
    id: selected.id.toString(),
    name: selected.name,
    level: 50,
    types: selected.types,
    stats: {
      hp: 100,
      maxHp: 100,
      attack: 85,
      defense: 80,
      speed: 90
    },
    sprite: selected.sprite
  };

  // Use the store contract for selection (UI -> store action)
  gameStore.setPlayerPokemon(props.playerId, pokemonData);
};
</script>

<template>
  <div class="player-area">
    <div class="player-header">
      <h2>Jogador {{ playerId }}</h2>
    </div>

    <div v-if="!pokemon" class="pokemon-selection">
      <div class="pokemon-list">
        <div 
          v-for="pkm in availablePokemon" 
          :key="pkm.id"
          class="pokemon-option"
          @click="selectPokemon(pkm)"
        >
          <img :src="pkm.sprite" :alt="pkm.name" class="pokemon-sprite" />
          <span class="pokemon-name">{{ pkm.name }}</span>
        </div>
      </div>
    </div>

    <div v-else class="pokemon-selected">
      <PokemonCard :pokemon="pokemon" />
    </div>
  </div>
</template>

<style scoped>
.player-area {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 16px;
}

.player-header {
  margin-bottom: 16px;
}

.player-header h2 {
  margin: 0;
  color: #374151;
  font-size: 1.125rem;
}

.pokemon-selection {
  text-align: center;
}

.pokemon-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
}

.pokemon-option {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.pokemon-option:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.pokemon-sprite {
  width: 80px;
  height: 80px;
  margin-bottom: 4px;
}

.pokemon-name {
  font-size: 0.75rem;
  color: #374151;
}

.pokemon-selected {
  margin-top: 16px;
}
</style>
