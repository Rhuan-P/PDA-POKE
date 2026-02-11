# [DO-2] Validador de docs

## Metadados
- ID: DO-2
- Squad: DevOps
- Prioridade: P0
- Dependencias: nenhuma
- Target: 15/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Detectar paths quebrados em docs/backlog automaticamente.

**Escopo:**
- Script `scripts/validate-doc-paths.cjs`
- Comando `npm run check:docs`
- CI rodando check

**Fora de escopo:**
- Validacao de links externos

**Regras arquiteturais:**
- CI deve falhar quando houver path quebrado

**Garantias do sistema:**
- Docs coerentes com estrutura real

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar scanner de links locais.
2. Integrar ao `package.json`.
3. Rodar no CI.

**Passos de implementacao:**
1. Ler markdown em `README.md`, `docs/`, `backlog/`.
2. Validar `[]()` e `code` com paths.
3. Retornar exit code 1 em erro.

**Separacao de responsabilidades:**
- DevOps: script e integracao

**Delegacao para squads:**
- DevOps: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- CI falha quando path local nao existe.

**Condicoes de sucesso:**
- Check passa no branch principal.

**O que invalida a entrega:**
- Script ignorando arquivos importantes.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
