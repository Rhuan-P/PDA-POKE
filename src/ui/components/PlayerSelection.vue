<template>
  <div class="player-selection-section">
    <h3>{{ playerIcon }} Jogador {{ playerId }}</h3>
    <div v-if="selectedPokemon" class="selected-card">
      <PokemonCard :pokemon="getPlayerPokemonData()" />
      <button class="change-btn" @click="clearSelection">
        Trocar Pokémon
      </button>
    </div>
    <div v-else class="selection-grid">
      <div 
        v-for="pokemon in pokemonList" 
        :key="pokemon.name"
        class="pokemon-option"
        @click="selectPokemon(pokemon.name)"
      >
        <img :src="getPokemonSprite(pokemon.name)" :alt="pokemon.name" class="pokemon-sprite">
        <span class="pokemon-name">{{ pokemon.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PokemonCard from './PokemonCard.vue'

const props = defineProps({
  playerId: {
    type: Number,
    required: true,
    validator: (value) => value === 1 || value === 2
  },
  selectedPokemon: {
    type: String,
    default: null
  },
  pokemonList: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['selectPokemon', 'clearSelection'])

const playerIcon = computed(() => props.playerId === 1 ? '🔵' : '🔴')

const selectPokemon = (pokemonName) => {
  emit('selectPokemon', props.playerId, pokemonName)
}

const clearSelection = () => {
  emit('clearSelection', props.playerId)
}

const getPlayerPokemonData = () => {
  if (!props.selectedPokemon) return null
  
  // Mapeamento de IDs para sprites
  const pokemonIds = {
    'bulbasaur': 1, 'ivysaur': 2, 'venusaur': 3,
    'charmander': 4, 'charmeleon': 5, 'charizard': 6,
    'squirtle': 7, 'wartortle': 8, 'blastoise': 9,
    'caterpie': 10, 'metapod': 11, 'butterfree': 12,
    'weedle': 13, 'kakuna': 14, 'beedrill': 15,
    'pidgey': 16, 'pidgeotto': 17, 'pidgeot': 18,
    'rattata': 19, 'raticate': 20,
    'spearow': 21, 'fearow': 22,
    'ekans': 23, 'arbok': 24,
    'pikachu': 25, 'raichu': 26,
    'sandshrew': 27, 'sandslash': 28,
    'nidoran-f': 29, 'nidorina': 30, 'nidoqueen': 31,
    'nidoran-m': 32, 'nidorino': 33, 'nidoking': 34,
    'clefairy': 35, 'clefable': 36,
    'vulpix': 37, 'ninetales': 38,
    'jigglypuff': 39, 'wigglytuff': 40,
    'zubat': 41, 'golbat': 42,
    'oddish': 43, 'gloom': 44, 'vileplume': 45,
    'paras': 46, 'parasect': 47,
    'venonat': 48, 'venomoth': 49,
    'diglett': 50, 'dugtrio': 51,
    'meowth': 52, 'persian': 53,
    'psyduck': 54, 'golduck': 55,
    'mankey': 56, 'primeape': 57,
    'growlithe': 58, 'arcanine': 59,
    'poliwag': 60, 'poliwhirl': 61, 'poliwrath': 62,
    'abra': 63, 'kadabra': 64, 'alakazam': 65,
    'machop': 66, 'machoke': 67, 'machamp': 68,
    'bellsprout': 69, 'weepinbell': 70, 'victreebel': 71,
    'tentacool': 72, 'tentacruel': 73,
    'geodude': 74, 'graveler': 75, 'golem': 76,
    'ponyta': 77, 'rapidash': 78,
    'slowpoke': 79, 'slowbro': 80,
    'magnemite': 81, 'magneton': 82,
    'farfetchd': 83,
    'doduo': 84, 'dodrio': 85,
    'seel': 86, 'dewgong': 87,
    'grimer': 88, 'muk': 89,
    'shellder': 90, 'cloyster': 91,
    'gastly': 92, 'haunter': 93, 'gengar': 94,
    'onix': 95,
    'drowzee': 96, 'hypno': 97,
    'krabby': 98, 'kingler': 99,
    'voltorb': 100, 'electrode': 101,
    'exeggcute': 102, 'exeggutor': 103,
    'cubone': 104, 'marowak': 105,
    'hitmonlee': 106, 'hitmonchan': 107, 'hitmontop': 108,
    'lickitung': 109,
    'koffing': 110, 'weezing': 111,
    'rhyhorn': 112, 'rhydon': 113,
    'chansey': 114,
    'tangela': 115,
    'kangaskhan': 116,
    'horsea': 117, 'seadra': 118,
    'goldeen': 119, 'seaking': 120,
    'staryu': 121, 'starmie': 122,
    'mr-mime': 123,
    'scyther': 124,
    'jynx': 125,
    'electabuzz': 126,
    'magmar': 127,
    'pinsir': 128,
    'tauros': 129,
    'magikarp': 130, 'gyarados': 131,
    'lapras': 132,
    'ditto': 133,
    'eevee': 134, 'vaporeon': 135, 'jolteon': 136, 'flareon': 137,
    'porygon': 138,
    'omanyte': 139, 'omastar': 140,
    'kabuto': 141, 'kabutops': 142,
    'aerodactyl': 143,
    'snorlax': 144,
    'articuno': 145,
    'zapdos': 146,
    'moltres': 147,
    'dratini': 148, 'dragonair': 149, 'dragonite': 150,
    'mewtwo': 151, 'mew': 151
  }
  
  // Mapeamento de tipos
  const pokemonTypes = {
    'bulbasaur': ['grass', 'poison'], 'ivysaur': ['grass', 'poison'], 'venusaur': ['grass', 'poison'],
    'charmander': ['fire'], 'charmeleon': ['fire'], 'charizard': ['fire', 'flying'],
    'squirtle': ['water'], 'wartortle': ['water'], 'blastoise': ['water'],
    'pikachu': ['electric'], 'raichu': ['electric'],
    'eevee': ['normal'], 'vaporeon': ['water'], 'jolteon': ['electric'], 'flareon': ['fire'],
    'snorlax': ['normal'], 'dragonite': ['dragon', 'flying'],
    'mewtwo': ['psychic'], 'mew': ['psychic']
  }
  
  const normalizedName = props.selectedPokemon.toLowerCase().trim()
  const id = pokemonIds[normalizedName] || 25
  const types = pokemonTypes[normalizedName] || ['normal']
  
  return {
    id: id.toString(),
    name: props.selectedPokemon,
    level: 50,
    types: types,
    stats: {
      hp: 100,
      maxHp: 100,
      attack: 85,
      defense: 80,
      speed: 90
    },
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  }
}

const getPokemonSprite = (pokemonName) => {
  const pokemonIds = {
    'bulbasaur': 1, 'ivysaur': 2, 'venusaur': 3,
    'charmander': 4, 'charmeleon': 5, 'charizard': 6,
    'squirtle': 7, 'wartortle': 8, 'blastoise': 9,
    'caterpie': 10, 'metapod': 11, 'butterfree': 12,
    'weedle': 13, 'kakuna': 14, 'beedrill': 15,
    'pidgey': 16, 'pidgeotto': 17, 'pidgeot': 18,
    'rattata': 19, 'raticate': 20,
    'spearow': 21, 'fearow': 22,
    'ekans': 23, 'arbok': 24,
    'pikachu': 25, 'raichu': 26,
    'sandshrew': 27, 'sandslash': 28,
    'nidoran-f': 29, 'nidorina': 30, 'nidoqueen': 31,
    'nidoran-m': 32, 'nidorino': 33, 'nidoking': 34,
    'clefairy': 35, 'clefable': 36,
    'vulpix': 37, 'ninetales': 38,
    'jigglypuff': 39, 'wigglytuff': 40,
    'zubat': 41, 'golbat': 42,
    'oddish': 43, 'gloom': 44, 'vileplume': 45,
    'paras': 46, 'parasect': 47,
    'venonat': 48, 'venomoth': 49,
    'diglett': 50, 'dugtrio': 51,
    'meowth': 52, 'persian': 53,
    'psyduck': 54, 'golduck': 55,
    'mankey': 56, 'primeape': 57,
    'growlithe': 58, 'arcanine': 59,
    'poliwag': 60, 'poliwhirl': 61, 'poliwrath': 62,
    'abra': 63, 'kadabra': 64, 'alakazam': 65,
    'machop': 66, 'machoke': 67, 'machamp': 68,
    'bellsprout': 69, 'weepinbell': 70, 'victreebel': 71,
    'tentacool': 72, 'tentacruel': 73,
    'geodude': 74, 'graveler': 75, 'golem': 76,
    'ponyta': 77, 'rapidash': 78,
    'slowpoke': 79, 'slowbro': 80,
    'magnemite': 81, 'magneton': 82,
    'farfetchd': 83,
    'doduo': 84, 'dodrio': 85,
    'seel': 86, 'dewgong': 87,
    'grimer': 88, 'muk': 89,
    'shellder': 90, 'cloyster': 91,
    'gastly': 92, 'haunter': 93, 'gengar': 94,
    'onix': 95,
    'drowzee': 96, 'hypno': 97,
    'krabby': 98, 'kingler': 99,
    'voltorb': 100, 'electrode': 101,
    'exeggcute': 102, 'exeggutor': 103,
    'cubone': 104, 'marowak': 105,
    'hitmonlee': 106, 'hitmonchan': 107, 'hitmontop': 108,
    'lickitung': 109,
    'koffing': 110, 'weezing': 111,
    'rhyhorn': 112, 'rhydon': 113,
    'chansey': 114,
    'tangela': 115,
    'kangaskhan': 116,
    'horsea': 117, 'seadra': 118,
    'goldeen': 119, 'seaking': 120,
    'staryu': 121, 'starmie': 122,
    'mr-mime': 123,
    'scyther': 124,
    'jynx': 125,
    'electabuzz': 126,
    'magmar': 127,
    'pinsir': 128,
    'tauros': 129,
    'magikarp': 130, 'gyarados': 131,
    'lapras': 132,
    'ditto': 133,
    'eevee': 134, 'vaporeon': 135, 'jolteon': 136, 'flareon': 137,
    'porygon': 138,
    'omanyte': 139, 'omastar': 140,
    'kabuto': 141, 'kabutops': 142,
    'aerodactyl': 143,
    'snorlax': 144,
    'articuno': 145,
    'zapdos': 146,
    'moltres': 147,
    'dratini': 148, 'dragonair': 149, 'dragonite': 150,
    'mewtwo': 151, 'mew': 151
  }
  
  const normalizedName = pokemonName.toLowerCase().trim()
  const id = pokemonIds[normalizedName] || 25
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
</script>

<style scoped>
.player-selection-section {
  flex: 1;
  background: #2d3748;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.player-selection-section h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
}

.selected-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.change-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.change-btn:hover {
  background: #c53030;
  transform: translateY(-1px);
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.pokemon-option {
  background: #4a5568;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pokemon-option:hover {
  background: #667eea;
  border-color: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.pokemon-sprite {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.pokemon-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
  text-align: center;
}
</style>
