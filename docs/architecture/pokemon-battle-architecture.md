# Arquitetura PDA-POKE

## VisÃ£o Geral

Este documento define a arquitetura oficial do PDA-POKE (PokÃ©mon Battle Simulator), projetada para ensino de boas prÃ¡ticas de desenvolvimento com separaÃ§Ã£o clara de responsabilidades.

## ðŸ‘¥ Duos e Responsabilidades

- **Duo DevOps:** Estrutura, CI/CD, documentaÃ§Ã£o, governanÃ§a
- **Duo User Experience:** Interface, APIs, estado reativo
- **Duo Game Logic:** Regras de negÃ³cio, cÃ¡lculos, validaÃ§Ãµes

## ðŸ—ï¸ Estrutura Oficial

```
src/
 â”œâ”€ domain/           # TypeScript - Regras puras do jogo (Duo Game Logic)
 â”‚  â”œâ”€ entities/        # Entidades (PokÃ©mon, Stats, Skills)
 â”‚  â”œâ”€ services/      # ServiÃ§os de domÃ­nio
 â”‚  â””â”€ utils/         # FunÃ§Ãµes utilitÃ¡rias
 â”œâ”€ application/      # TypeScript - OrquestraÃ§Ã£o e fluxos
 â”‚  â”œâ”€ controllers/   # Controladores de aplicaÃ§Ã£o
 â”‚  â””â”€ interfaces/    # Interfaces entre camadas
 â”œâ”€ services/         # JavaScript - APIs externas (Duo User Experience)
 â”‚  â””â”€ pokeApiService.js     # ComunicaÃ§Ã£o com PokeAPI
 â”œâ”€ state/            # JavaScript - Estado reativo (Pinia) (Duo User Experience)
 â”‚  â””â”€ gameStore.js   # Store principal do jogo
 â”œâ”€ ui/               # Vue 3 - Componentes visuais (Duo User Experience)
 â”‚  â”œâ”€ components/    # Componentes reutilizÃ¡veis
 â”‚  â”œâ”€ views/         # Views principais
 â”‚  â””â”€â”€ App.vue       # Componente raiz
 â””â”€ assets/           # Recursos estÃ¡ticos
    â””â”€ styles/        # Estilos globais
```

## ðŸŽ¯ DecisÃ£o Arquitetural: Vue Como Biblioteca

Usamos **Vue 3 como biblioteca**, nÃ£o como framework completo:

- âœ… **Apenas reatividade e renderizaÃ§Ã£o** - Sem Vue Router, Vuex
- âœ… **Controle total** - Implementamos apenas o necessÃ¡rio
- âœ… **Performance otimizada** - Sem sobrecarga
- âœ… **Aprendizado focado** - Conceitos sobre framework

## ðŸ”„ Fluxo de Dados

1. **UsuÃ¡rio** interage com **UI** (Vue Components)
2. **Services** chamam APIs externas (PokeAPI)
3. **State** gerencia estado reativo (Pinia)
4. **Application** orquestra fluxos quando necessÃ¡rio
5. **Domain** contÃ©m regras puras do jogo

## ðŸ“‹ Regras Importantes

### Domain Layer (TypeScript)
- **Sem dependÃªncias** externas
- **FunÃ§Ãµes puras** e testÃ¡veis
- **Regras de negÃ³cio** isoladas

### Services/State/UI (JavaScript)
- **Vue como biblioteca** (Composition API)
- **Pinia** para estado global
- **APIs externas** isoladas

### ComunicaÃ§Ã£o Entre Camadas
- **Domain** â†’ **Application** (interfaces)
- **Application** â†’ **Services** (quando necessÃ¡rio)
- **UI** â†’ **State** (reatividade)
- **Services** â†’ **UI** (dados externos)
```

**O que NÃƒO pode ter:**
- HTML, templates Vue, CSS
- CÃ¡lculos complexos (isso Ã© domain)

**Regra:** Application decide quando, Domain decide como.

### 3ï¸âƒ£ services/ â€” ComunicaÃ§Ã£o Externa (JavaScript)
**Responsabilidade:** Time UX

Faz integraÃ§Ã£o com APIs externas:
- ComunicaÃ§Ã£o com a PokeAPI
- Tratamento de erros
- Cache de dados

**O que DEVE ter:**
```
services/
 â”œâ”€ interfaces/
 â”‚  â””â”€ index.ts          # Interfaces dos serviÃ§os
 â”œâ”€ pokeApiService.js     # Cliente da PokeAPI
 â””â”€ index.js              # Barrel export
```

**O que NÃƒO pode ter:**
- Regras de batalha
- LÃ³gica de vencedor
- Estados globais
- Vue / DOM

**Regra:** Services buscam dados, nÃ£o tomam decisÃµes.

### 4ï¸âƒ£ state/ â€” Estado da AplicaÃ§Ã£o (JavaScript)
**Responsabilidade:** Time UX

Centraliza o estado reativo da UI:
- PokÃ©mon escolhidos
- Resultado da batalha
- Controle do modal
- Flags de loading e erro

**O que DEVE ter:**
  actions: {
    setPlayer1Pokemon(pokemon) {
      this.player1Pokemon = pokemon;
    },
    applyDamage(pokemonId, damage) {
      // Atualiza estado baseado na lÃ³gica da application
    }
  }
});
```

### 5. UI (Vue/JavaScript) ðŸŽ¨

**Responsabilidade:** Componentes visuais e renderizaÃ§Ã£o.

**O que PODE existir:**
- Componentes Vue (.vue)
- Views (blueprints)
- RenderizaÃ§Ã£o condicional
- Event handlers simples

**O que Ã© PROIBIDO:**
- LÃ³gica de negÃ³cio
- CÃ¡lculos complexos
- RequisiÃ§Ãµes HTTP
- Estado global (usar stores)

**Exemplo de arquivo:**
```vue
<!-- ui/components/BattleArena.vue -->
<template>
  <div class="battle-arena">
    <PokemonCard :pokemon="player1Pokemon" />
    <BattleButton @attack="handleAttack" />
    <PokemonCard :pokemon="player2Pokemon" />
  </div>
</template>

<script setup>
import { useBattleStore } from '../state/battle-store';
import { executeAttack } from '../application/battle-use-case';

const battleStore = useBattleStore();

function handleAttack(skillId) {
  executeAttack(battleStore.player1Pokemon.id, battleStore.player2Pokemon.id, skillId);
}
</script>
```

### 6. Assets ðŸ“

**Responsabilidade:** Recursos estÃ¡ticos da aplicaÃ§Ã£o.

**O que PODE existir:**
- Imagens de pokÃ©mons
- Ãcones de tipos
- Sprites
- Arquivos CSS/SCSS

**O que Ã© PROIBIDO:**
- CÃ³digo JavaScript/TypeScript
- LÃ³gica de negÃ³cio

## NavegaÃ§Ã£o Bidirecional

### De Cima para Baixo (Arquitetura â†’ CÃ³digo)

1. **UI chama Application** via use cases
2. **Application chama Services** para dados externos
3. **Application chama Domain** para regras de negÃ³cio
4. **Application atualiza State** com resultados
5. **UI reage ao State** via reatividade

```
UI Component â†’ Application Use Case â†’ Service API â†’ Domain Logic â†’ State Update â†’ UI React
```

### De Baixo para Cima (Arquivo â†’ Responsabilidade)

1. **Arquivo:** `src/domain/utils/StatCalculator.ts`
   - **Pasta:** `domain/`
   - **Camada:** Domain
   - **Responsabilidade:** Regras puras do jogo

2. **Arquivo:** `src/services/pokeApiService.js`
   - **Pasta:** `services/`
   - **Camada:** Services
   - **Responsabilidade:** ComunicaÃ§Ã£o com PokeAPI

3. **Arquivo:** `src/ui/components/BattleButton.vue`
   - **Pasta:** `ui/components/`
   - **Camada:** UI
   - **Responsabilidade:** Interface visual

## Regras de Ouro

### âœ… Sempre FaÃ§a
- Mantenha lÃ³gica de negÃ³cio no Domain
- Use TypeScript para regras crÃ­ticas
- Separe claramente as responsabilidades
- Teste unidades do Domain isoladamente

### âŒ Nunca FaÃ§a
- Misture lÃ³gica de batalha em componentes Vue
- Use TypeScript em toda a UI (apenas onde crucial)
- Crie funÃ§Ãµes gigantes
- Esconda lÃ³gica em templates Vue

## Fluxo de Desenvolvimento

1. **Comece pelo Domain:** Defina as regras do jogo
2. **Crie Services:** Implemente comunicaÃ§Ã£o com APIs
3. **Desenvolva Application:** Orquestre os fluxos
4. **Configure State:** Defina o estado reativo
5. **Construa UI:** Crie componentes visuais
6. **Integre Tudo:** Conecte as camadas

## ValidaÃ§Ã£o de Arquitetura

Para validar se a arquitetura estÃ¡ correta:

1. **O Domain nÃ£o conhece nada externo?**
2. **A UI nÃ£o tem lÃ³gica de negÃ³cio?**
3. **Services apenas fazem requisiÃ§Ãµes?**
4. **Application apenas orquestra?**
5. **State apenas armazena estado?**

Se resposta for sim para todos, a arquitetura estÃ¡ correta.

