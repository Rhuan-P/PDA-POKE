# [UX-8] Fonte de Skills (MVP)

## Metadados
- ID: UX-8
- Squad: User Experience
- Prioridade: P0
- Dependencias: GL-7
- Target: 20/02/2026
- Paralelizavel: sim (apos GL-7)

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Disponibilizar dados de skills para o fluxo MVP.

**Escopo:**
- Implementar `getSkill` no service
- Fonte inicial pode ser mock local

**Fora de escopo:**
- Integracao completa com PokeAPI moves

**Regras arquiteturais:**
- Services sem logica de negocio
- Dados normalizados

**Garantias do sistema:**
- `getSkill` retorna skill valida

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Definir lista MVP de skills (ex: tackle, ember, water-gun, vine-whip).
2. Implementar `getSkill` em `src/services/pokeApiService.js` (stub ok).
3. Mapear dados para contrato do Domain.

**Passos de implementacao:**
1. Criar map de skills com `id`, `type`, `power`, `cooldown`, `accuracy`.
2. `getSkill(skillId)` retorna skill do map.
3. Garantir consistencia com `docs/contracts/skill.md`.

**Separacao de responsabilidades:**
- Service: dados externos
- Domain: validacoes

**Delegacao para squads:**
- Squad B: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- `getSkill` retorna skill valida para ids MVP.
- Erro claro para skill inexistente.

**Condicoes de sucesso:**
- Testes com mocks em `BattleUseCase`.

**O que invalida a entrega:**
- Skill sem campos obrigatorios.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
