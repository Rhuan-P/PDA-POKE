# [GL-3] TypeEffectiveness MVP

## Metadados
- ID: GL-3
- Squad: Game Logic
- Prioridade: P0
- Dependencias: nenhuma
- Target: 17/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Implementar matriz de efetividade de tipos minima para MVP.

**Escopo:**
- Definir tipos MVP (ex: fire, water, grass, electric, normal)
- Implementar `getEffectiveness` e/ou `getTypeAdvantage`

**Fora de escopo:**
- Matriz completa de todos os tipos

**Regras arquiteturais:**
- Constantes puras
- Sem IO

**Garantias do sistema:**
- Eficacia consistente para os tipos MVP

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Preencher matriz em `src/domain/utils/TypeEffectiveness.ts` e/ou `src/domain/constants/TypeChart.ts`.
2. Implementar funcao de consulta.
3. Adicionar testes unitarios.

**Passos de implementacao:**
1. Definir tipos MVP.
2. Declarar multiplicadores (2, 1, 0.5, 0).
3. Implementar fallback para 1.

**Separacao de responsabilidades:**
- `TypeChart`: dados
- `TypeEffectiveness`: consulta

**Delegacao para squads:**
- Squad A: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Casos super efetivo, neutro e resistente retornam valores corretos.
- Tipo desconhecido retorna 1.

**Condicoes de sucesso:**
- Testes com pelo menos 6 combinacoes.

**O que invalida a entrega:**
- Tabela incompleta para os tipos MVP definidos.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
