# Backlog Squad B - Application / UI / Services / State

## Visão Geral

**Responsabilidade:** Implementar camadas de aplicação, serviços, estado e interface do usuário. Esta squad conecta o domínio com o mundo externo.

## Task 1: Implementar Services Layer

### 🔹 DTR - Definição Técnica de Requisitos
**Objetivo técnico:** Criar camada de serviços para comunicação com PokeAPI e APIs externas

**Escopo:** Serviços completos com fetch, tratamento de erros e cache simples

**Fora de escopo:** Lógica de negócio, estado da aplicação, componentes UI

**Regras arquiteturais:** JavaScript/TypeScript leve, async/await, zero dependências de Vue

**Garantias do sistema:** Comunicação robusta com APIs externas

---

### 🔹 DTI - Definição Técnica de Implementação
**Tasks técnicas:**
1. Implementar PokemonService para PokeAPI
2. Criar sistema de tratamento de erros
3. Adicionar cache simples para requisições
4. Implementar transformação de dados

**Passos de implementação:**
1. Criar interfaces em `/src/services/interfaces/`
   - `src/services/interfaces/IPokemonService.ts` - contratos da API
   - `src/services/interfaces/IApiClient.ts` - cliente HTTP genérico
2. Implementar serviços em `/src/services/`
   - `src/services/pokemon-service.js` - comunicação com PokeAPI
   - `src/services/api-client.js` - cliente HTTP reutilizável
   - `src/services/error-handler.js` - tratamento centralizado de erros
3. Criar utilitários em `/src/services/utils/`
   - `src/services/utils/cache.js` - cache simples em memória
   - `src/services/utils/data-transformer.js` - transformação de dados da API

**Separação de responsabilidades:**
- PokemonService: Comunicação com PokeAPI
- ApiClient: Requisições HTTP genéricas
- ErrorHandler: Tratamento de erros de API
- Squad B: Implementar toda camada de serviços

**Fora de escopo:** Lógica de negócio, estado da UI, renderização

**Regras arquiteturais:** JavaScript puro, sem dependências de UI, testabilidade de integração

**Garantias do sistema:** Dados sempre disponíveis e cache eficiente

---

### DTI - Definição Técnica de Implementação
**Tasks técnicas:**

#### 1.1 Implementar cliente PokeAPI
**Arquivo:** `src/services/pokeApiService.js`
**Responsável:** Time UX

**Implementação:**
- Classe `PokeApiService` com métodos de API
- Interface `PokemonAPI` para tipagem
- Tratamento robusto de erros
- Sistema de cache simples

**Métodos obrigatórios:**
```javascript
async fetchPokemon(name)           // Busca Pokémon por nome
async searchPokemon(query)         // Busca por termo
async getPokemonList(limit)        // Lista de Pokémons
```

**Regras de ouro:**
- Fetch com try/catch
- Tratamento de status HTTP
- Cache com TTL de 5 minutos
- Normalização de dados
- Proibido: lógica de negócio, fetch direto

#### 1.2 Implementar interfaces de serviços
**Arquivo:** `src/services/interfaces/index.ts`
**Responsável:** Time UX

**Implementação:**
- Interfaces TypeScript para contratos
- Export centralizado
- Tipagem para respostas da API

---

### DTA - Definição Técnica de Aceite
**Critérios objetivos de aceite:**

#### 1.1 Testes de Integração
- [ ] `fetchPokemon` com Pokémon existente
- [ ] `fetchPokemon` com Pokémon inexistente
- [ ] `searchPokemon` com múltiplos resultados
- [ ] Cache funcionando corretamente

#### 1.2 Tratamento de Erros
- [ ] Erros de rede tratados
- [ ] Pokémon não encontrado
- [ ] Timeouts tratados
- [ ] Mensagens amigáveis

#### 1.3 Performance
- [ ] Cache reduzindo requisições
- [ ] Tempo de resposta < 2s
- [ ] Sem memory leaks
- [ ] Lazy loading implementado

#### 1.4 Qualidade de Código
- [ ] JavaScript moderno (ES6+)
- [ ] ESLint sem warnings
- [ ] Comentários explicando APIs
- [ ] Nomenclatura consistente

---

## Task 2: Implementar Estado Reativo

### DTR - Definição Técnica de Requisitos
**Objetivo técnico:** Criar estado global reativo com Pinia

**Escopo:** Stores para batalha, getters computados, actions reativas

**Fora de escopo:** Lógica de negócio, comunicação direta com APIs

**Regras arquiteturais:** JavaScript com Pinia, estado imutável, reatividade declarativa

**Garantias do sistema:** Estado sempre sincronizado e reativo

---

### DTI - Definição Técnica de Implementação
**Tasks técnicas:**

#### 2.1 Criar store principal
**Arquivo:** `src/state/gameStore.js`
**Responsável:** Time UX

**Implementação:**
- Store com Pinia para estado da batalha
- Getters computados para estado derivado
- Actions para mutações do estado
- Persistência se necessário

**Estado obrigatório:**
```javascript
state: {
  player1Pokemon: null,
  player2Pokemon: null,
  battleStatus: 'idle', // idle, selecting, ready, finished
  currentTurn: 1,
  winner: null,
  loading: false,
  error: null,
  battleLog: []
}
```

**Getters obrigatórios:**
```javascript
bothPlayersReady()     // Ambos jogadores prontos?
canStartBattle()      // Pode iniciar batalha?
currentPlayerPokemon()  // Pokémon do turno atual
```

**Actions obrigatórias:**
```javascript
setPlayer1Pokemon(pokemon)
setPlayer2Pokemon(pokemon)
setBattleStatus(status)
setLoading(loading)
setError(error)
addLog(message)
resetBattle()
```

**Regras de ouro:**
- Estado imutável (actions criam novos objetos)
- Getters sem efeitos colaterais
- Actions síncronas para estado local
- Logging de ações para debug
- Proibido: lógica de negócio, fetch direto

---

### DTA - Definição Técnica de Aceite
**Critérios objetivos de aceite:**

#### 2.1 Testes de Estado
- [ ] Todos os getters testados
- [ ] Todas as actions testadas
- [ ] Reatividade funcionando
- [ ] Imutabilidade do estado

#### 2.2 Integração com UI
- [ ] Componentes reagem a mudanças
- [ ] Estado persiste se necessário
- [ ] Debug tools funcionando
- [ ] Performance aceitável

#### 2.3 Qualidade de Código
- [ ] Pinia patterns seguidos
- [ ] Estado serializável
- [ ] Sem mutações diretas
- [ ] Documentação completa

---

## Task 3: Implementar Componentes UI

### DTR - Definição Técnica de Requisitos
**Objetivo técnico:** Criar interface visual com Vue 3 como biblioteca

**Escopo:** Componentes reutilizáveis, views principais, layout responsivo

**Fora de escopo:** Lógica de negócio, estado global, comunicação com APIs

**Regras arquiteturais:** Vue 3 como biblioteca, JavaScript, componentes puros, reatividade declarativa

**Garantias do sistema:** Interface intuitiva e responsiva

---

### DTI - Definição Técnica de Implementação
**Tasks técnicas:**

#### 3.1 Criar componentes base
**Arquivos:** `src/ui/components/`
**Responsável:** Time UX

**Implementação:**

##### PokemonCard.vue
- Exibição visual do Pokémon
- Barras de HP e stats
- Indicadores de tipo
- Estados visuais (derrotado, ativo)

##### BattleButton.vue
- Botões reutilizáveis com estados
- Loading e disabled
- Múltiplos tipos (primary, danger, etc)
- Feedback visual

##### PlayerArea.vue
- Área completa do jogador
- Busca de Pokémon
- Exibição do card quando selecionado
- Estados de loading e erro

**Regras de ouro:**
- Props validadas com TypeScript
- Emits bem definidos
- Slots para conteúdo customizável
- Estilos scoped e responsivos
- Proibido: lógica de negócio, fetch direto

#### 3.2 Criar views principais
**Arquivos:** `src/ui/views/`
**Responsável:** Time UX

**Implementação:**

##### BattleView.vue
- Layout principal da batalha
- Integração de todos os componentes
- Modal de resultados
- Log da batalha

**Regras de ouro:**
- Composição de componentes
- Estado vindo do store
- Eventos para actions
- Responsividade completa
- Proibido: estado local, lógica complexa

#### 3.3 Criar componente raiz
**Arquivo:** `src/ui/App.vue`
**Responsável:** Time UX

**Implementação:**
- Estrutura básica da aplicação
- Importação de estilos globais
- Provider do Pinia
- Configurações globais

---

### DTA - Definição Técnica de Aceite
**Critérios objetivos de aceite:**

#### 3.1 Testes de Componentes
- [ ] Todos os componentes testados
- [ ] Interação usuário testada
- [ ] Responsividade validada
- [ ] Acessibilidade verificada

#### 3.2 Integração Completa
- [ ] Comunicação com store funcionando
- [ ] Eventos disparam corretamente
- [ ] Estado reativo atualizado
- [ ] Sem memory leaks

#### 3.3 Qualidade de Código
- [ ] Vue 3 best practices
- [ ] Componentes puros e testáveis
- [ ] Performance aceitável
- [ ] Documentação com exemplos

---

## Task 4: Implementar Bootstrap

### DTR - Definição Técnica de Requisitos
**Objetivo técnico:** Criar ponto de entrada da aplicação

**Escopo:** Inicialização Vue, configuração Pinia, montagem da aplicação

**Fora de escopo:** Lógica de negócio, configurações complexas

---

### DTI - Definição Técnica de Implementação
**Tasks técnicas:**

#### 4.1 Criar bootstrap
**Arquivo:** `src/main.js`
**Responsável:** Time UX

**Implementação:**
- createApp do Vue 3
- Configuração do Pinia
- Montagem no DOM
- Importação de estilos

**Regras de ouro:**
- Vue como biblioteca (não framework)
- Configuração mínima
- Tratamento de erros
- Performance otimizada
- Proibido: lógica de negócio, configurações complexas

---

### DTA - Definição Técnica de Aceite
**Critérios objetivos de aceite:**
- [ ] Aplicação inicia sem erros
- [ ] Pinia configurado corretamente
- [ ] Vue montado no elemento correto
- [ ] Estilos carregados

---

## Estrutura de Arquivos Esperada

```
src/
├── services/
│   ├── interfaces/
│   │   └── index.ts          Contratos dos serviços
│   ├── pokeApiService.js        Cliente da API
│   └── index.js                Barrel export
│   │   ├── cache.js
│   │   └── data-transformer.js
│   └── index.js
├── application/
│   ├── interfaces/
│   │   ├── IBattleUseCase.ts
│   │   ├── IPokemonSelectionUseCase.ts
│   │   ├── IEventBus.ts
│   │   └── index.ts
│   ├── use-cases/
│   │   ├── BattleUseCase.ts
│   │   └── PokemonSelectionUseCase.ts
│   ├── orchestrators/
│   │   └── GameOrchestrator.ts
│   ├── events/
│   │   └── EventBus.ts
│   └── index.ts
├── state/
│   ├── stores/
│   │   ├── battle-store.js
│   │   ├── pokemon-store.js
│   │   └── ui-store.js
│   ├── composables/
│   │   ├── useBattle.js
│   │   └── usePokemon.js
│   ├── utils/
│   │   ├── state-helpers.js
│   │   └── reactivity-helpers.js
│   └── index.js
├── ui/
│   ├── components/
│   │   ├── PokemonCard.vue
│   │   ├── BattleButton.vue
│   │   ├── HealthBar.vue
│   │   └── Modal.vue
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── BattleView.vue
│   │   └── PokemonSelectionView.vue
│   ├── layout/
│   │   ├── AppLayout.vue
│   │   └── Header.vue
│   ├── styles/
│   │   ├── main.css
│   │   └── components.css
│   └── index.js
├── integration/
│   ├── ui-state-integration.js
│   ├── state-app-integration.js
│   └── app-services-integration.js
├── handlers/
│   ├── error-handler.js
│   └── loading-handler.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── sprites/
└── main.js
```

## Fluxo de Trabalho Squad B

1. **Implementar Services** primeiro (base da comunicação)
2. **Criar Application** (orquestração e use cases)
3. **Configurar State** (gerenciamento reativo)
4. **Construir UI** (componentes e views)
5. **Integrar Tudo** (conexões entre camadas)
6. **Testar E2E** (fluxo completo)

## Fluxo de Comunicação

```
UI Component → State Store → Application Use Case → Service API → Domain Logic
     ↑                                                              ↓
     ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## Integração com Domain

- **Application:** Usa entidades e regras do domain
- **Services:** Transforma dados da API para entidades do domain
- **State:** Armazena instâncias de entidades do domain
- **UI:** Exibe dados das entidades do domain via state
