# [UX-2] PokemonSelectionUseCase

## Metadados
- ID: UX-2
- Squad: User Experience
- Prioridade: P0
- Dependencias: UX-1
- Target: 19/02/2026
- Paralelizavel: sim (apos UX-1)

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Orquestrar selecao de Pokemon via Application.

**Escopo:**
- `PokemonSelectionUseCase` em `src/application/use-cases/PokemonSelectionUseCase.ts`
- Validacao de playerId

**Fora de escopo:**
- UI
- Persistencia

**Regras arquiteturais:**
- Application nao faz fetch direto
- Usa Services por interface

**Garantias do sistema:**
- Retorna Pokemon normalizado

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar `PokemonSelectionUseCase`.
2. Definir contrato em `src/application/interfaces/IPokemonSelectionUseCase.ts`.
3. Testes com mocks.

**Passos de implementacao:**
1. Injetar `IPokemonService`.
2. Validar `playerId`.
3. Chamar `getPokemonByName`.

**Separacao de responsabilidades:**
- Use case: orquestracao
- Service: comunicacao externa

**Delegacao para squads:**
- Squad B: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Use case nao acessa fetch.
- Erros propagados corretamente.

**Condicoes de sucesso:**
- Teste com mock passa.

**O que invalida a entrega:**
- Dependencia direta em UI/State.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
