# PokÃ©mon Battle Simulator

Um simulador de batalhas PokÃ©mon educacional com arquitetura limpa e separaÃ§Ã£o clara de responsabilidades.

## ðŸŽ¯ VisÃ£o Geral

Este projeto Ã© um exemplo educacional de como construir aplicaÃ§Ãµes frontend complexas usando arquitetura em camadas, Vue 3 como biblioteca, TypeScript e JavaScript de forma organizada e escalÃ¡vel.

## ðŸ‘¥ Equipes

- **LÃ­der do Projeto:** Arquitetura + Apoio DevOps
- **Time UX (2 pessoas):** Interface do usuÃ¡rio, comunicaÃ§Ã£o com APIs, estado reativo
- **Time Game Logic:** Regras de negÃ³cio, cÃ¡lculos, validaÃ§Ãµes

## ðŸ—ï¸ Arquitetura

O projeto segue uma arquitetura em 5 camadas bem definidas:

```
src/
 â”œâ”€ domain/           # TypeScript - Regras puras do jogo (Time Game Logic)
 â”œâ”€ application/      # TypeScript - OrquestraÃ§Ã£o e fluxos
 â”œâ”€ services/         # JavaScript - ComunicaÃ§Ã£o com APIs (Time UX)
 â”œâ”€ state/            # JavaScript - Estado reativo (Pinia) (Time UX)
 â”œâ”€ ui/               # Vue/JavaScript - Componentes visuais (Time UX)
 â”œâ”€ assets/           # Imagens, Ã­cones, recursos estÃ¡ticos
 â””â”€ main.js           # Bootstrap da aplicaÃ§Ã£o (Vue como biblioteca)
```

### ðŸ“š DocumentaÃ§Ã£o Completa

- **[ðŸ“– DocumentaÃ§Ã£o TÃ©cnica](./docs/README.md)** - Guia completo para desenvolvedores
- **[ðŸ—ï¸ Arquitetura Principal](./docs/architecture/pokemon-battle-architecture.md)** - DefiniÃ§Ã£o detalhada das camadas
- **[ðŸ› ï¸ Guia de ImplementaÃ§Ã£o](./docs/architecture/implementation-guide.md)** - Passo a passo prÃ¡tico

## ðŸš€ ComeÃ§ando

### PrÃ©-requisitos

- Node.js >= 18.0.0
- npm ou yarn

### InstalaÃ§Ã£o

```bash
# Clone o repositÃ³rio
git clone https://github.com/seu-usuario/PDA-POKE.git
cd PDA-POKE

# Instale as dependÃªncias
npm install

# Inicie o ambiente de desenvolvimento
npm run dev
```

### Scripts DisponÃ­veis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produÃ§Ã£o
npm run test     # Executa testes
npm run lint     # Verifica cÃ³digo
npm run lint:fix # Corrige automaticamente
```

## ðŸ“‹ Estrutura do Projeto

### Domain Layer (`src/domain/`) - **Time Game Logic**
**Responsabilidade:** Regras puras do jogo PokÃ©mon
- CÃ¡lculo de dano e eficÃ¡cia de tipos
- ValidaÃ§Ã£o de jogadas e estado
- Entidades: Pokemon, Battle, Stats

### Application Layer (`src/application/`) - **OrquestraÃ§Ã£o**
**Responsabilidade:** CoordenaÃ§Ã£o entre camadas
- Use cases de batalha
- ComunicaÃ§Ã£o entre UI, Services e Domain
- Sistema de eventos

### Services Layer (`src/services/`) - **Time UX**
**Responsabilidade:** ComunicaÃ§Ã£o externa
- Cliente da PokeAPI
- Tratamento de erros
- Cache de dados

### State Layer (`src/state/`) - **Time UX**
**Responsabilidade:** Estado reativo da UI
- Stores com Pinia
- Getters computados
- Actions reativas

### UI Layer (`src/ui/`) - **Time UX**
**Responsabilidade:** Interface visual
- Componentes Vue 3 (como biblioteca)
- Views e layouts
- InteraÃ§Ã£o com usuÃ¡rio

## ðŸŽ® Funcionalidades

- âœ… SeleÃ§Ã£o de PokÃ©mons via API
- âœ… Sistema de batalha por turnos
- âœ… CÃ¡lculo de dano baseado em tipos
- âœ… Interface responsiva e reativa
- âœ… Estado global com Pinia

## ðŸ§ª Testes

O projeto utiliza testes para garantir qualidade:

```bash
# Testes unitÃ¡rios (Domain)
npm run test:unit

# Testes de integraÃ§Ã£o (Application)
npm run test:integration

# Testes E2E (UI)
npm run test:e2e

# Todos os testes
npm run test
```

## ðŸ“Š Qualidade

- **Lint:** ESLint com regras especÃ­ficas por camada
- **TypeScript:** Para camadas crÃ­ticas (Domain, Application)
- **JavaScript:** Para Services, State, UI
- **Vue:** Como biblioteca, nÃ£o framework completo
- **Test Coverage:** > 80% para cÃ³digo crÃ­tico

## ðŸ¤ Como Contribuir

### Para o Time Game Logic
1. **Implemente as entidades** em `src/domain/entities/`
2. **Desenvolva as regras** em `src/domain/services/`
3. **Crie cÃ¡lculos** em `src/domain/utils/`
4. **Mantenha pureza:** Sem dependÃªncias externas

### Para o Time UX
1. **Implemente serviÃ§os** em `src/services/`
2. **Crie componentes** em `src/ui/components/`
3. **Desenvolva views** em `src/ui/views/`
4. **Configure estado** em `src/state/`
5. **Use Vue como biblioteca:** Apenas reatividade

### Para DevOps
1. **Configure ambiente** de desenvolvimento
2. **Implemente pipeline** de CI/CD
3. **Garanta qualidade** do cÃ³digo
4. **Documente processos**

## ðŸ“œ LicenÃ§a

MIT License - veja [LICENSE](LICENSE) para detalhes

## ðŸ”— Links Ãšteis

- **[DocumentaÃ§Ã£o TÃ©cnica](./docs/README.md)**
- **[Arquitetura Completa](./docs/architecture/pokemon-battle-architecture.md)**
- **[Guia de ImplementaÃ§Ã£o](./docs/architecture/implementation-guide.md)**
- **[Backlog Game Logic](./backlog/backlog-squad-a.md)**
- **[Backlog UX](./backlog/backlog-squad-b.md)**
- **[Backlog DevOps](./backlog/backlog-devops.md)**

---

**âš ï¸ Nota:** Este Ã© um projeto educacional focado em demonstrar boas prÃ¡ticas de arquitetura frontend. A implementaÃ§Ã£o prioriza clareza e separaÃ§Ã£o de responsabilidades sobre otimizaÃ§Ãµes avanÃ§adas.

