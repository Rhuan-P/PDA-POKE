# Guia de Implementação - Pokémon Battle Simulator

## Visão Geral

Este guia prático ajuda desenvolvedores a implementar o Pokémon Battle Simulator seguindo a arquitetura definida. Focado em evitar erros comuns e garantir separação clara de responsabilidades.

## Fluxo de Implementação Recomendado

### 1. Comece pelo Domain (Fundação)
```
Domain é a base sólida sobre a qual tudo é construído.
```

**Por que começar aqui?**
- Regras de negócio são estáveis e testáveis
- Dependências circulares são evitadas
- Testes unitários são mais fáceis

**Passo a passo:**
1. Defina interfaces em `src/domain/interfaces/`
2. Implemente entidades em `src/domain/entities/`
3. Crie cálculos em `src/domain/calculators/`
4. Teste tudo isoladamente

### 2. Implemente Services (Comunicação)
```
Services conectam seu mundo com o mundo externo.
```

**Por que em segundo?**
- Dependem de ninguém
- Podem ser testados com mocks
- Application precisa deles para funcionar

**Passo a passo:**
1. Crie interfaces em `src/services/interfaces/`
2. Implemente clientes HTTP em `src/services/`
3. Adicione tratamento de erros
4. Teste com APIs reais e mocks

### 3. Crie Application (Orquestração)
```
Application é o maestro que rege a orquestra.
```

**Por que em terceiro?**
- Depende de Domain e Services
- Conecta tudo sem saber detalhes
- Prepara para State e UI

**Passo a passo:**
1. Defina use cases em `src/application/interfaces/`
2. Implemente orquestração em `src/application/use-cases/`
3. Crie sistema de eventos
4. Teste integração entre camadas

### 4. Configure State (Reatividade)
```
State é a memória viva da aplicação.
```

**Por que em quarto?**
- Precisa de Application para funcionar
- UI precisa dele para reagir
- Camada intermediária crucial

**Passo a passo:**
1. Crie stores em `src/state/stores/`
2. Implemente composables em `src/state/composables/`
3. Conecte com Application use cases
4. Teste reatividade

### 5. Construa UI (Apresentação)
```
UI é a vitrine que mostra o trabalho das outras camadas.
```

**Por que por último?**
- Depende de todas as outras camadas
- Mais volátil e propenso a mudanças
- Testes de UI são mais complexos

**Passo a passo:**
1. Crie componentes em `src/ui/components/`
2. Implemente views em `src/ui/views/`
3. Conecte com State stores
4. Teste interações

## Padrões e Anti-Padrões

### ✅ Padrões Recomendados

#### Domain Layer
```typescript
// ✅ BOM: Entidade pura e testável
export class Pokemon {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly stats: PokemonStats,
    public readonly types: PokemonType[]
  ) {}

  takeDamage(damage: number): Pokemon {
    const newHp = Math.max(0, this.stats.hp - damage);
    return new Pokemon(
      this.id,
      this.name,
      { ...this.stats, hp: newHp },
      this.types
    );
  }
}
```

#### Services Layer
```javascript
// ✅ BOM: Serviço focado e testável
export const pokemonService = {
  async getPokemon(id) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) throw new Error(`Pokemon ${id} not found`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching pokemon:', error);
      throw error;
    }
  }
};
```

#### Application Layer
```typescript
// ✅ BOM: Use case orquestrando sem conhecer detalhes
export class BattleUseCase {
  constructor(
    private pokemonService: IPokemonService,
    private damageCalculator: IDamageCalculator,
    private battleStore: IBattleStore
  ) {}

  async executeAttack(attackerId: string, defenderId: string, skillId: string) {
    const attacker = await this.pokemonService.getPokemon(attackerId);
    const defender = await this.pokemonService.getPokemon(defenderId);
    const skill = await this.pokemonService.getSkill(skillId);
    
    const damage = this.damageCalculator.calculate(attacker, defender, skill);
    this.battleStore.applyDamage(defenderId, damage);
  }
}
```

#### State Layer
```javascript
// ✅ BOM: Store reativa e focada
export const useBattleStore = defineStore('battle', {
  state: () => ({
    player1Pokemon: null,
    player2Pokemon: null,
    currentTurn: null,
    battleLog: []
  }),
  
  actions: {
    setPlayer1Pokemon(pokemon) {
      this.player1Pokemon = pokemon;
    },
    
    applyDamage(pokemonId, damage) {
      // Apenas atualiza estado, não calcula dano
      if (this.player1Pokemon?.id === pokemonId) {
        this.player1Pokemon = this.player1Pokemon.takeDamage(damage);
      }
    }
  }
});
```

#### UI Layer
```vue
<!-- ✅ BOM: Componente focado em apresentação -->
<template>
  <div class="pokemon-card">
    <img :src="pokemon.sprite" :alt="pokemon.name" />
    <h3>{{ pokemon.name }}</h3>
    <HealthBar :current="pokemon.stats.hp" :max="pokemon.stats.maxHp" />
    <BattleButton 
      v-for="skill in pokemon.skills"
      :key="skill.id"
      :skill="skill"
      @click="handleAttack(skill.id)"
    />
  </div>
</template>

<script setup>
import { useBattleStore } from '../state/battle-store';
import { BattleUseCase } from '../application/battle-use-case';

const props = defineProps(['pokemon']);
const battleStore = useBattleStore();
const battleUseCase = new BattleUseCase(/* dependencies */);

function handleAttack(skillId) {
  // Apenas dispara ação, não contém lógica
  battleUseCase.executeAttack(props.pokemon.id, battleStore.opponentPokemon.id, skillId);
}
</script>
```

### ❌ Anti-Padrões a Evitar

#### Domain com Dependências Externas
```typescript
// ❌ RUIM: Domain conhecendo APIs
export class Pokemon {
  async loadFromApi(id: string) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.json(); // VIOLAÇÃO: Domain não deve conhecer APIs
  }
}
```

#### UI com Lógica de Negócio
```vue
<!-- ❌ RUIM: Componente com cálculo de dano -->
<script setup>
function calculateDamage(attacker, defender, skill) {
  const effectiveness = getTypeEffectiveness(skill.type, defender.types);
  return Math.floor((attacker.attack * skill.power / defender.defense) * effectiveness);
  // VIOLAÇÃO: Lógica de negócio no componente
}
</script>
```

#### Services com Estado
```javascript
// ❌ RUIM: Service mantendo estado
let cachedPokemons = {};

export const pokemonService = {
  async getPokemon(id) {
    if (!cachedPokemons[id]) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      cachedPokemons[id] = await response.json();
    }
    return cachedPokemons[id];
    // VIOLAÇÃO: Service não deve manter estado
  }
};
```

#### Application Acessando Diretamente APIs
```typescript
// ❌ RUIM: Application com fetch direto
export class BattleUseCase {
  async startBattle(pokemon1Id: string, pokemon2Id: string) {
    const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon1Id}`);
    const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2Id}`);
    // VIOLAÇÃO: Application deve usar Services
  }
}
```

## Testes por Camada

### Domain Tests (Unitários)
```typescript
describe('Pokemon', () => {
  it('should take damage correctly', () => {
    const pokemon = new Pokemon('1', 'Bulbasaur', { hp: 100, attack: 10 }, ['grass']);
    const damagedPokemon = pokemon.takeDamage(30);
    
    expect(damagedPokemon.stats.hp).toBe(70);
    expect(damagedPokemon.id).toBe('1'); // Imutabilidade preservada
  });
});
```

### Service Tests (Integração)
```javascript
describe('PokemonService', () => {
  it('should fetch pokemon from API', async () => {
    const pokemon = await pokemonService.getPokemon('1');
    
    expect(pokemon).toBeDefined();
    expect(pokemon.name).toBe('bulbasaur');
  });
  
  it('should handle API errors', async () => {
    await expect(pokemonService.getPokemon('999')).rejects.toThrow();
  });
});
```

### Application Tests (Integração)
```typescript
describe('BattleUseCase', () => {
  it('should execute attack correctly', async () => {
    const mockService = { getPokemon: jest.fn(), getSkill: jest.fn() };
    const mockCalculator = { calculate: jest.fn().mockReturnValue(25) };
    const mockStore = { applyDamage: jest.fn() };
    
    const useCase = new BattleUseCase(mockService, mockCalculator, mockStore);
    await useCase.executeAttack('1', '2', 'tackle');
    
    expect(mockCalculator.calculate).toHaveBeenCalled();
    expect(mockStore.applyDamage).toHaveBeenCalledWith('2', 25);
  });
});
```

### UI Tests (Componentes)
```javascript
describe('PokemonCard', () => {
  it('should render pokemon information', () => {
    const pokemon = { id: '1', name: 'Bulbasaur', stats: { hp: 100 } };
    
    const wrapper = mount(PokemonCard, { props: { pokemon } });
    
    expect(wrapper.text()).toContain('Bulbasaur');
    expect(wrapper.find('img').attributes('src')).toBeDefined();
  });
});
```

## Troubleshooting Comum

### Problema: "Não sei onde colocar este código"

**Solução: Use o fluxo de decisão**

1. **É uma regra de negócio pura?** → Domain
2. **Envolve comunicação externa?** → Services
3. **Orquestra múltiplas camadas?** → Application
4. **É estado que a UI precisa?** → State
5. **É algo que o usuário vê?** → UI

### Problema: "Minha UI está muito complexa"

**Sinais:**
- Componentes com mais de 200 linhas
- Lógica de negócio em templates
- Múltiplas responsabilidades no mesmo componente

**Soluções:**
- Extraia lógica para composables
- Divida componentes menores
- Mova cálculos para Application
- Use stores para estado complexo

### Problema: "Meus Services estão acoplados"

**Sinais:**
- Services chamando outros services
- Lógica de negócio em services
- Estado compartilhado entre services

**Soluções:**
- Use Application para orquestrar
- Mantenha services focados
- Implemente cache separadamente

### Problema: "Meu Domain está instável"

**Sinais:**
- Mudanças frequentes que quebram outras camadas
- Dependências externas aparecendo
- Testes quebrando sem motivo claro

**Soluções:**
- Revise interfaces e contratos
- Verifique se há vazamento de responsabilidades
- Forteça testes unitários

## Checklists de Validação

### Antes de Commitar (Domain)
- [ ] Sem dependências externas (fetch, console, etc)
- [ ] Todos os métodos testados unitariamente
- [ ] Imutabilidade preservada onde aplicável
- [ ] Interfaces claras e estáveis

### Antes de Commitar (Services)
- [ ] Tratamento de erros implementado
- [ ] Sem lógica de negócio
- [ ] Cache implementado se necessário
- [ ] Testes com mocks e APIs reais

### Antes de Commitar (Application)
- [ ] Injeção de dependência funcionando
- [ ] Sem comunicação direta com APIs
- [ ] Use cases testados com mocks
- [ ] Eventos sendo emitidos corretamente

### Antes de Commitar (State)
- [ ] Sem lógica de negócio nas stores
- [ ] Actions reativas funcionando
- [ ] Getters sem efeitos colaterais
- [ ] Estado inicial bem definido

### Antes de Commitar (UI)
- [ ] Componentes testados isoladamente
- [ ] Sem estado global nos componentes
- [ ] Eventos emitidos corretamente
- [ ] Responsividade funcionando

## Próximos Passos

1. **Revise a arquitetura** antes de começar
2. **Comece pequeno** com uma funcionalidade simples
3. **Teste cada camada** antes de integrar
4. **Refatore constantemente** para manter separação
5. **Documente decisões** importantes

Lembre-se: arquitetura é sobre trade-offs. O mais importante é manter a separação clara e a comunicação bem definida entre as camadas.
