# [GL-6] Constantes e Rules

## Metadados
- ID: GL-6
- Squad: Game Logic
- Prioridade: P1
- Dependencias: GL-1
- Target: 20/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Consolidar constantes e regras para evolucao do dominio.

**Escopo:**
- Preencher `src/domain/constants/`
- Implementar regras basicas em `src/domain/rules/`

**Fora de escopo:**
- Regras avancadas (status, itens)

**Regras arquiteturais:**
- Sem IO
- Constantes imutaveis

**Garantias do sistema:**
- Padroes centralizados
- Facil manutencao

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Preencher constantes em `DamageConstants`, `BattleStatus`, `ActionType`.
2. Implementar `TurnManager`, `ActionValidator`, `VictoryConditions`.

**Passos de implementacao:**
1. Revisar constantes usadas no MVP.
2. Implementar validacoes minimas (ex: attack permitido).
3. Garantir regras testaveis.

**Separacao de responsabilidades:**
- Constantes: dados
- Rules: validacoes

**Delegacao para squads:**
- Squad A: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Constantes usadas sem strings magicas.
- Regras com testes unitarios minimos.

**Condicoes de sucesso:**
- Importacao sem circularidade.

**O que invalida a entrega:**
- Regras com efeitos colaterais.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
