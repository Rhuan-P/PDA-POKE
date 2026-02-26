/**
 * MockDataService - Serviço de dados mock para Pokémons
 * DevOps Squad - Webhook Battle System
 * 
 * Responsável por fornecer dados mockados de Pokémons
 * enquanto as outras squads implementam as entidades reais.
 * 
 * Este serviço será substituído pelas entidades reais quando
 * Squad A finalizar GL-1, GL-2, GL-3, GL-4.
 */

class MockDataService {
  /**
   * Mock de Pokémons básicos com stats balanceados
   * Estes dados serão substituídos pelas entidades reais
   */
  static mockPokemon = {
    '25': {
      id: '25',
      name: 'Pikachu',
      level: 50,
      types: ['electric'],
      stats: {
        hp: 100,
        maxHp: 100,
        attack: 85,
        defense: 80,
        speed: 90,
        specialAttack: 90,
        specialDefense: 80
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      abilities: ['static', 'lightning-rod']
    },
    '6': {
      id: '6',
      name: 'Charizard',
      level: 50,
      types: ['fire', 'flying'],
      stats: {
        hp: 120,
        maxHp: 120,
        attack: 95,
        defense: 85,
        speed: 80,
        specialAttack: 110,
        specialDefense: 85
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
      abilities: ['blaze', 'solar-power']
    },
    '1': {
      id: '1',
      name: 'Bulbasaur',
      level: 50,
      types: ['grass', 'poison'],
      stats: {
        hp: 110,
        maxHp: 110,
        attack: 80,
        defense: 90,
        speed: 70,
        specialAttack: 85,
        specialDefense: 90
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      abilities: ['overgrow', 'chlorophyll']
    },
    '7': {
      id: '7',
      name: 'Squirtle',
      level: 50,
      types: ['water'],
      stats: {
        hp: 100,
        maxHp: 100,
        attack: 75,
        defense: 95,
        speed: 75,
        specialAttack: 85,
        specialDefense: 105
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
      abilities: ['torrent', 'rain-dish']
    },
    '133': {
      id: '133',
      name: 'Eevee',
      level: 50,
      types: ['normal'],
      stats: {
        hp: 95,
        maxHp: 95,
        attack: 80,
        defense: 85,
        speed: 85,
        specialAttack: 80,
        specialDefense: 90
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
      abilities: ['run-away', 'adaptability']
    },
    '94': {
      id: '94',
      name: 'Gengar',
      level: 50,
      types: ['ghost', 'poison'],
      stats: {
        hp: 90,
        maxHp: 90,
        attack: 95,
        defense: 80,
        speed: 110,
        specialAttack: 120,
        specialDefense: 80
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
      abilities: ['cursed-body', 'levitate']
    },
    '149': {
      id: '149',
      name: 'Dragonite',
      level: 50,
      types: ['dragon', 'flying'],
      stats: {
        hp: 130,
        maxHp: 130,
        attack: 110,
        defense: 95,
        speed: 80,
        specialAttack: 100,
        specialDefense: 95
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png',
      abilities: ['inner-focus', 'multiscale']
    },
    '143': {
      id: '143',
      name: 'Snorlax',
      level: 50,
      types: ['normal'],
      stats: {
        hp: 160,
        maxHp: 160,
        attack: 100,
        defense: 85,
        speed: 30,
        specialAttack: 75,
        specialDefense: 110
      },
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png',
      abilities: ['immunity', 'thick-fat']
    }
  };

  /**
   * Mock de habilidades (skills)
   * Será substituído por GL-2 Skill Entity
   */
  static mockSkills = {
    'tackle': {
      id: 'tackle',
      name: 'Tackle',
      type: 'normal',
      category: 'physical',
      power: 40,
      accuracy: 100,
      pp: 35,
      maxPp: 35,
      priority: 0,
      description: 'A physical attack made with the whole body.'
    },
    'thunderbolt': {
      id: 'thunderbolt',
      name: 'Thunderbolt',
      type: 'electric',
      category: 'special',
      power: 90,
      accuracy: 100,
      pp: 15,
      maxPp: 15,
      priority: 0,
      description: 'A strong electric blast is fired at the target.'
    },
    'flamethrower': {
      id: 'flamethrower',
      name: 'Flamethrower',
      type: 'fire',
      category: 'special',
      power: 90,
      accuracy: 100,
      pp: 15,
      maxPp: 15,
      priority: 0,
      description: 'The target is scorched with an intense blast of fire.'
    },
    'water-gun': {
      id: 'water-gun',
      name: 'Water Gun',
      type: 'water',
      category: 'special',
      power: 40,
      accuracy: 100,
      pp: 25,
      maxPp: 25,
      priority: 0,
      description: 'The target is blasted with a forceful shot of water.'
    },
    'razor-leaf': {
      id: 'razor-leaf',
      name: 'Razor Leaf',
      type: 'grass',
      category: 'physical',
      power: 55,
      accuracy: 95,
      pp: 25,
      maxPp: 25,
      priority: 0,
      description: 'Sharp leaves are launched at the target.'
    },
    'shadow-ball': {
      id: 'shadow-ball',
      name: 'Shadow Ball',
      type: 'ghost',
      category: 'special',
      power: 80,
      accuracy: 100,
      pp: 15,
      maxPp: 15,
      priority: 0,
      description: 'The user hurls a shadowy blob at the target.'
    },
    'dragon-claw': {
      id: 'dragon-claw',
      name: 'Dragon Claw',
      type: 'dragon',
      category: 'physical',
      power: 80,
      accuracy: 100,
      pp: 15,
      maxPp: 15,
      priority: 0,
      description: 'The user slashes the target with huge claws.'
    },
    'hyper-beam': {
      id: 'hyper-beam',
      name: 'Hyper Beam',
      type: 'normal',
      category: 'special',
      power: 150,
      accuracy: 90,
      pp: 5,
      maxPp: 5,
      priority: 0,
      description: 'The target is attacked with a powerful beam.'
    },
    'quick-attack': {
      id: 'quick-attack',
      name: 'Quick Attack',
      type: 'normal',
      category: 'physical',
      power: 40,
      accuracy: 100,
      pp: 30,
      maxPp: 30,
      priority: 1,
      description: 'The user moves faster than the eye can follow.'
    }
  };

  /**
   * Obter dados de um Pokémon mockado
   * @param {string} pokemonId - ID do Pokémon
   * @returns {Promise<Object>} - Dados completos do Pokémon
   */
  static async getPokemon(pokemonId) {
    const pokemon = this.mockPokemon[pokemonId];
    
    if (!pokemon) {
      throw new Error(`Pokémon ${pokemonId} não encontrado no mock data`);
    }
    
    // Retornar cópia para evitar mutação
    return {
      ...pokemon,
      skills: this.getPokemonSkills(pokemonId),
      currentHp: pokemon.stats.hp,
      status: null // healthy, poisoned, burned, paralyzed, sleep, frozen
    };
  }

  /**
   * Obter habilidades de um Pokémon baseado em seus tipos
   * @param {string} pokemonId - ID do Pokémon
   * @returns {Array} - Lista de habilidades disponíveis
   */
  static getPokemonSkills(pokemonId) {
    const pokemon = this.mockPokemon[pokemonId];
    const skills = [];
    
    // Tackle universal
    skills.push({ ...this.mockSkills['tackle'], currentPp: this.mockSkills['tackle'].pp });
    
    // Habilidade baseada no tipo principal
    const typeSkill = this.getTypeSkill(pokemon.types[0]);
    if (typeSkill) {
      skills.push({ ...typeSkill, currentPp: typeSkill.pp });
    }
    
    // Habilidade especial baseada no Pokémon
    const specialSkill = this.getSpecialSkill(pokemonId);
    if (specialSkill) {
      skills.push({ ...specialSkill, currentPp: specialSkill.pp });
    }
    
    return skills;
  }

  /**
   * Obter habilidade baseada no tipo
   * @param {string} type - Tipo do Pokémon
   * @returns {Object|null} - Habilidade correspondente
   */
  static getTypeSkill(type) {
    const typeSkills = {
      'electric': this.mockSkills['thunderbolt'],
      'fire': this.mockSkills['flamethrower'],
      'water': this.mockSkills['water-gun'],
      'grass': this.mockSkills['razor-leaf'],
      'ghost': this.mockSkills['shadow-ball'],
      'dragon': this.mockSkills['dragon-claw'],
      'normal': this.mockSkills['hyper-beam']
    };
    
    return typeSkills[type] || null;
  }

  /**
   * Obter habilidade especial do Pokémon
   * @param {string} pokemonId - ID do Pokémon
   * @returns {Object|null} - Habilidade especial
   */
  static getSpecialSkill(pokemonId) {
    const specialSkills = {
      '25': this.mockSkills['quick-attack'], // Pikachu - Quick Attack
      '94': this.mockSkills['shadow-ball'],   // Gengar - Shadow Ball
      '149': this.mockSkills['dragon-claw']   // Dragonite - Dragon Claw
    };
    
    return specialSkills[pokemonId] || null;
  }

  /**
   * Obter todos os Pokémons disponíveis
   * @returns {Array} - Lista de Pokémons básicos
   */
  static getAllPokemon() {
    return Object.keys(this.mockPokemon).map(id => ({
      id,
      name: this.mockPokemon[id].name,
      types: this.mockPokemon[id].types,
      sprite: this.mockPokemon[id].sprite
    }));
  }

  /**
   * Obter todas as habilidades disponíveis
   * @returns {Array} - Lista de todas as habilidades
   */
  static getAllSkills() {
    return Object.values(this.mockSkills);
  }

  /**
   * Calcular dano mockado
   * Será substituído por GL-4 Damage Calculator
   * @param {Object} attacker - Pokémon atacante
   * @param {Object} defender - Pokémon defensor
   * @param {Object} skill - Habilidade usada
   * @returns {number} - Dano calculado
   */
  static calculateDamage(attacker, defender, skill) {
    // Mock calculation - será substituído por GL-4
    const basePower = skill.power || 40;
    const attackStat = skill.category === 'physical' ? attacker.stats.attack : attacker.stats.specialAttack;
    const defenseStat = skill.category === 'physical' ? defender.stats.defense : defender.stats.specialDefense;
    
    // Cálculo básico (será substituído por fórmula real)
    const damage = Math.floor(
      (basePower * (attackStat / defenseStat)) * 
      (0.85 + Math.random() * 0.15) // 85-100% variance
    );
    
    return Math.max(1, damage); // Mínimo 1 de dano
  }

  /**
   * Verificar efetividade de tipo
   * Será substituído por sistema real de GL-2
   * @param {string} attackType - Tipo do ataque
   * @param {Array} defenderTypes - Tipos do defensor
   * @returns {number} - Multiplicador de efetividade
   */
  static getTypeEffectiveness(attackType, defenderTypes) {
    // Mock type chart - será substituído por sistema real
    const effectiveness = {
      'fire': { 'grass': 2, 'water': 0.5, 'fire': 0.5 },
      'water': { 'fire': 2, 'grass': 0.5, 'water': 0.5 },
      'grass': { 'water': 2, 'fire': 0.5, 'grass': 0.5 },
      'electric': { 'water': 2, 'grass': 0.5, 'electric': 0.5 },
      'ghost': { 'ghost': 2, 'normal': 0 },
      'dragon': { 'dragon': 2 },
      'normal': { 'ghost': 0 }
    };
    
    let multiplier = 1;
    
    for (const defenderType of defenderTypes) {
      const typeChart = effectiveness[attackType];
      if (typeChart && typeChart[defenderType]) {
        multiplier *= typeChart[defenderType];
      }
    }
    
    return multiplier;
  }

  /**
   * Obter estatísticas do serviço
   * @returns {Object} - Estatísticas dos mocks
   */
  static getStats() {
    return {
      totalPokemon: Object.keys(this.mockPokemon).length,
      totalSkills: Object.keys(this.mockSkills).length,
      types: [...new Set(Object.values(this.mockPokemon).flatMap(p => p.types))],
      categories: [...new Set(Object.values(this.mockSkills).map(s => s.category))]
    };
  }
}

module.exports = MockDataService;
