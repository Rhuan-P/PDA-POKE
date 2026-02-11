# [DO-3] Template de PR

## Metadados
- ID: DO-3
- Squad: DevOps
- Prioridade: P1
- Dependencias: nenhuma
- Target: 16/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Padronizar PR com DTR/DTI/DTA.

**Escopo:**
- `.github/PULL_REQUEST_TEMPLATE.md`

**Fora de escopo:**
- Automacoes de merge

**Regras arquiteturais:**
- Template deve exigir DTR/DTI/DTA

**Garantias do sistema:**
- Revisoes com contexto tecnico completo

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Criar template com secoes DTR/DTI/DTA.

**Passos de implementacao:**
1. Escrever template com campos obrigatorios.
2. Validar no GitHub.

**Separacao de responsabilidades:**
- DevOps: template

**Delegacao para squads:**
- DevOps: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- PR aberto exibe template.

**Condicoes de sucesso:**
- Revisores conseguem validar DTA facilmente.

**O que invalida a entrega:**
- Template sem DTR/DTI/DTA.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
