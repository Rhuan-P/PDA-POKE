# [GL-5] BattleService

## Metadados
- ID: GL-5
- Squad: Game Logic
- Prioridade: P0
- Dependencias: GL-1, GL-4
- Target: 19/02/2026
- Paralelizavel: sim (apos GL-4)

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Implementar orquestracao de batalha pura no dominio.

**Escopo:**
- `calculateDamage`
- `getTurnOrder`
- `simulateBattle`
- `getWinner`

**Fora de escopo:**
- Integracao com UI/State
- Persistencia

**Regras arquiteturais:**
- Dominio puro
- Sem efeitos colaterais

**Garantias do sistema:**
- Vencedor correto
- Ordem de turno baseada em speed

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar metodos em `src/domain/services/battleService.ts`.
2. Usar `DamageCalculator` e `TurnManager`.
3. Gerar log de turnos em `simulateBattle`.

**Passos de implementacao:**
1. `getTurnOrder` por speed.
2. `calculateDamage` delega ao calculator.
3. `simulateBattle` executa loop ate um pokemon derrotado.
4. `getWinner` retorna null em empate.

**Separacao de responsabilidades:**
- `BattleService`: fluxo de combate
- `DamageCalculator`: calculo

**Delegacao para squads:**
- Squad A: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Ordem de turno correta com speeds diferentes.
- Batalha termina quando hp <= 0.
- `getWinner` coerente.

**Condicoes de sucesso:**
- Testes cobrindo batalhas simples.

**O que invalida a entrega:**
- Loop infinito.
- Mutacao de objetos sem retorno imutavel.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
