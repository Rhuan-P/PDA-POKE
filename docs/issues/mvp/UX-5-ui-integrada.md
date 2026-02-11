# [UX-5] UI integrada

## Metadados
- ID: UX-5
- Squad: User Experience
- Prioridade: P0
- Dependencias: UX-4
- Target: 24/02/2026
- Paralelizavel: sim (apos UX-4)

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Integrar UI ao State e fluxo completo de batalha.

**Escopo:**
- `src/ui/views/BattleView.vue`
- `src/ui/components/PlayerArea.vue`
- `src/ui/components/PokemonCard.vue`
- `src/ui/components/BattleButton.vue`

**Fora de escopo:**
- Design final refinado

**Regras arquiteturais:**
- UI sem logica de negocio
- UI consome Store

**Garantias do sistema:**
- Fluxo de selecao -> batalha -> resultado

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Ajustar componentes para usar Store e actions.
2. Remover dados mockados na UI (ou isolar em Dev only).
3. Garantir renderizacao de HP e status.

**Passos de implementacao:**
1. `PlayerArea` chama action de selecao.
2. `BattleView` usa `canStartBattle` e `executeTurn`.
3. `PokemonCard` usa dados reativos do store.

**Separacao de responsabilidades:**
- UI: apresentacao
- Store: estado

**Delegacao para squads:**
- Squad B: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Seleciona 2 pokemons e inicia batalha.
- Turno alterna corretamente.
- Modal de resultado aparece ao fim.

**Condicoes de sucesso:**
- Testes manuais com checklist.

**O que invalida a entrega:**
- UI calculando dano.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
