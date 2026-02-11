# [DO-1] CI valido e bloqueante

## Metadados
- ID: DO-1
- Squad: DevOps
- Prioridade: P0
- Dependencias: nenhuma
- Target: 15/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Garantir pipeline CI com lint, testes e build bloqueantes.

**Escopo:**
- Workflow `.github/workflows/ci.yml`
- Instalacao de dependencias de dev

**Fora de escopo:**
- Deploy

**Regras arquiteturais:**
- CI deve falhar em erro

**Garantias do sistema:**
- Qualidade minima por PR

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Ajustar `npm ci` para instalar dev deps.
2. Rodar `lint`, `test`, `build` sem bypass no `.github/workflows/ci.yml`.

**Passos de implementacao:**
1. Atualizar `.github/workflows/ci.yml`.
2. Validar execucao no CI.

**Separacao de responsabilidades:**
- DevOps: pipeline

**Delegacao para squads:**
- DevOps: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- CI falha em lint/test/build quebrados.

**Condicoes de sucesso:**
- Pipeline verde no branch principal.

**O que invalida a entrega:**
- Bypass com `|| echo`.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
