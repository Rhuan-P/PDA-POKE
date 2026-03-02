# 🎮 PDA-POKE - Pokémon Battle Simulator

> Um simulador de batalhas Pokémon com arquitetura limpa e metodologia DTF

---

## 🎯 Visão Geral

PDA-POKE é um simulador de batalhas Pokémon educacional que demonstra arquitetura limpa, separação clara de responsabilidades e metodologia DTF (Definição Técnica por Fases).

### 🏗️ Arquitetura

```
src/
├── domain/           # 🧠 Lógica de negócio pura (TypeScript)
├── application/      # 🎮 Orquestração e fluxos (TypeScript)
├── services/         # 🌐 Comunicação com APIs (JavaScript)
├── state/           # 📊 Estado global (Pinia)
├── ui/              # 🎨 Interface visual (Vue 3)
└── assets/          # 📁 Recursos estáticos
```

---

## 👥 Times e Responsabilidades

### 🎮 Game Logic Squad
- **Focus**: Entidades, regras, cálculos
- **Files**: `src/domain/`
- **Issues**: GL

### 🎨 User Experience Squad  
- **Focus**: Interface, serviços, estado
- **Files**: `src/services/`, `src/state/`, `src/ui/`
- **Issues**: UX

### ⚙️ DevOps Squad
- **Focus**: Infraestrutura, CI/CD, qualidade
- **Files**: `.github/`, scripts, docs
- **Issues**: DO

---

## 🚀 Começando

### Pré-requisitos
- Node.js >= 18.0.0
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/Rhuan-P/PDA-POKE.git
cd PDA-POKE

# Instale as dependências
npm install

# Inicie o desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run test     # Executa testes
npm run lint     # Verifica código
npm run lint:fix # Corrige automaticamente
npm run check:docs # Valida documentação
```

---

## 📋 Metodologia DTF

Este projeto segue rigorosamente a **Definição Técnica por Fases**:

### 🔹 DTR - Definição Técnica de Requisitos
- **O QUÊ**: Problema e objetivo
- **POR QUÊ**: Contexto e impacto  
- **PARA QUÊ**: Benefícios esperados

### 🔹 DTI - Definição Técnica de Implementação
- **COMO**: Tasks técnicas e passos
- **ONDE**: Arquivos e componentes
- **QUANDO**: Dependências e ordem

### 🔹 DTA - Definição Técnica de Aceite
- **CRITÉRIOS**: Como validar sucesso
- **MÉTRICAS**: Como medir qualidade
- **BLOQUEADORES**: O que impede entrega

---

## 🎯 MVP Roadmap

### Milestone: MVP 01/03/2026

**Game Logic (7 issues)**
- [ ] GL-1 Entidade Pokemon
- [ ] GL-2 StatCalculator
- [ ] GL-3 TypeEffectiveness MVP
- [ ] GL-4 DamageCalculator
- [ ] GL-5 BattleService
- [ ] GL-6 Constantes e Rules
- [ ] GL-7 Entidade Skill

**User Experience (8 issues)**
- [ ] UX-1 PokeApiService + cache
- [ ] UX-2 PokemonSelectionUseCase
- [ ] UX-3 BattleUseCase
- [ ] UX-4 State sem logica
- [ ] UX-5 UI integrada
- [ ] UX-6 Modal e HealthBar
- [ ] UX-7 E2E MVP
- [ ] UX-8 Fonte de Skills

**DevOps (4 issues)**
- [ ] DO-1 CI valido e bloqueante
- [ ] DO-2 Validador de docs
- [ ] DO-3 Template de PR
- [ ] DO-4 Checklist release MVP

---

## 🔧 Padrões de Código

### TypeScript (Domain & Application)
```typescript
// Interfaces para contratos
interface Pokemon {
  id: string
  name: string
  level: number
  stats: PokemonStats
}

// Classes puras
export class PokemonModel {
  static create(name: string, level: number): Pokemon {
    // Validações e criação
  }
}
```

### Vue 3 (UI)
```vue
<template>
  <div class="pokemon-card">
    <h2>{{ pokemon.name }}</h2>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePokemonStore } from '../../state/stores/pokemonStore'

const props = defineProps<{
  pokemonId: string
}>()

const pokemonStore = usePokemonStore()
const pokemon = computed(() => pokemonStore.getPokemon(props.pokemonId))
</script>
```

---

## 🧪 Testes

```bash
# Testes unitários (Domain)
npm run test:unit

# Testes de integração (Application)
npm run test:integration

# Testes E2E (UI)
npm run test:e2e

# Todos os testes
npm run test
```

---

## 📊 Qualidade

- **Coverage**: > 80% unit, > 60% integration
- **Lint**: ESLint com regras específicas
- **TypeScript**: Strict mode para Domain/Application
- **CI/CD**: Pipeline automatizado

---

## 🤝 Como Contribuir

### 1. Escolha uma Issue
- Verifique as [issues abertas](https://github.com/Rhuan-P/PDA-POKE/issues)
- Filtre por sua squad: `?label=team:game-logic`, `?label=team:ux`, `?label=team:devops`

### 2. Crie uma Branch
```bash
git checkout -b feature/GL-1-entidade-pokemon
```

### 3. Desenvolva com DTF
- Preencha DTR na issue
- Implemente seguindo DTI
- Valide com DTA

### 4. Pull Request
- Use template DTF
- Aguarde code review
- Merge após aprovação

---

## 📚 Documentação

- **[Setup](docs/setup/README.md)** - Guia para novos membros
- **[Arquitetura](docs/architecture/pokemon-battle-architecture.md)** - Detalhes técnicos
- **[Padrões DTF](docs/dtf/template-task-dtf.md)** - Convenções e boas práticas
- **[Contribuição](CONTRIBUTING.md)** - Guia completo de contribuição

---

## 🏷️ Labels

### Times
- `team:game-logic` - Entidades, regras, cálculos
- `team:ux` - Interface, serviços, estado  
- `team:devops` - Infra, CI/CD, qualidade

### Prioridade
- `priority:p0` - Crítico
- `priority:p1` - Importante
- `priority:p2` - Baixo

---

## 📜 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes

---

## 🔗 Links Úteis

- **[Repositório](https://github.com/Rhuan-P/PDA-POKE)**
- **[Issues](https://github.com/Rhuan-P/PDA-POKE/issues)**
- **[Milestone MVP](https://github.com/Rhuan-P/PDA-POKE/milestone/1)**
- **[CI/CD](https://github.com/Rhuan-P/PDA-POKE/actions)**

---

**⚡ Vamos construir algo incrível juntos!** 🚀
