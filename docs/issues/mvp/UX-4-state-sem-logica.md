# [UX-4] State sem logica de negocio

## Metadados
- ID: UX-4
- Squad: User Experience
- Prioridade: P0
- Dependencias: UX-2, UX-3
- Target: 22/02/2026
- Paralelizavel: sim (apos UX-2/UX-3)

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Garantir que o State nao contenha logica de negocio.

**Escopo:**
- Ajustar `src/state/stores/gameStore.js`
- Actions chamam use cases
- Remover calculo de dano da store

**Fora de escopo:**
- UI

**Regras arquiteturais:**
- Store apenas estado e actions simples

**Garantias do sistema:**
- Dano calculado no Domain/Application

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Refatorar actions `executeTurn` e `startBattle`.
2. Integrar `BattleUseCase` e `PokemonSelectionUseCase`.
3. Garantir logs e status via actions sem regras de negocio.

**Passos de implementacao:**
1. Inject/instanciar use cases.
2. `executeTurn` delega calculo e aplica resultado do use case.
3. Manter apenas atualizacao de estado local.

**Separacao de responsabilidades:**
- Store: estado
- Use cases: regras

**Delegacao para squads:**
- Squad B: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Store nao faz calculo de dano.
- Store nao usa random para logica de combate.

**Condicoes de sucesso:**
- Testes simples de actions.

**O que invalida a entrega:**
- Logica de negocio dentro do store.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
