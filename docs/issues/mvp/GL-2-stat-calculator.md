# [GL-2] StatCalculator

## Metadados
- ID: GL-2
- Squad: Game Logic
- Prioridade: P0
- Dependencias: GL-1
- Target: 17/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Implementar calculos de stats por nivel e modificadores.

**Escopo:**
- `calculateByLevel`
- `calculateAllStats`
- `applyModifiers`

**Fora de escopo:**
- Efeitos de tipo
- Criticos

**Regras arquiteturais:**
- Funcoes puras
- Sem IO

**Garantias do sistema:**
- Cálculo deterministico
- Resultado coerente com formulas

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar funcoes em `src/domain/utils/StatCalculator.ts`.
2. Documentar formulas.
3. Adicionar testes unitarios.

**Passos de implementacao:**
1. Implementar `calculateByLevel(baseStat, level)`.
2. Implementar `calculateAllStats(baseStats, level)`.
3. Implementar `applyModifiers(stats, modifiers)`.
4. Ajustar valores minimos para evitar negativos.

**Separacao de responsabilidades:**
- `StatCalculator`: apenas calculos.

**Delegacao para squads:**
- Squad A: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Funcoes retornam valores esperados em niveis 1, 50, 100.
- `applyModifiers` preserva campos nao informados.

**Condicoes de sucesso:**
- Testes cobrindo pelo menos 6 cenarios.

**O que invalida a entrega:**
- Uso de random ou Date.
- Alteracao direta do input.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
