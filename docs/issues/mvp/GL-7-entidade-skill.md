# [GL-7] Entidade Skill

## Metadados
- ID: GL-7
- Squad: Game Logic
- Prioridade: P0
- Dependencias: nenhuma
- Target: 19/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Implementar a entidade Skill (habilidade) no Domain com validacoes e metodos puros.

**Escopo:**
- Interface e modelo Skill
- Metodos `isReady`, `getCooldownRemaining`, `isValid`, `toJSON`, `fromJSON`
- Validacoes de campos basicos

**Fora de escopo:**
- Aplicacao de efeitos
- Execucao de batalha

**Regras arquiteturais:**
- Dominio puro (sem IO)
- Imutabilidade

**Garantias do sistema:**
- Skills sempre validas
- Serializacao consistente

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar interface/entidade em `src/domain/entities/Skill.ts`.
2. Adicionar validacoes conforme contrato em `docs/contracts/skill.md`.
3. Criar testes unitarios da entidade.

**Passos de implementacao:**
1. Definir interface `Skill` e classe `SkillModel`.
2. Implementar `isReady` e `getCooldownRemaining`.
3. Implementar `isValid` com validacoes de campo.
4. Implementar `toJSON` e `fromJSON`.

**Separacao de responsabilidades:**
- `SkillModel`: validacoes e consultas

**Delegacao para squads:**
- Squad A: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Validacoes seguem `docs/contracts/skill.md`.
- Metodos retornam valores consistentes e deterministas.

**Condicoes de sucesso:**
- Testes unitarios cobrindo validacoes e cooldown.

**O que invalida a entrega:**
- Mutacao do objeto original.
- Dependencias externas.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
