# [UX-6] Modal e HealthBar

## Metadados
- ID: UX-6
- Squad: User Experience
- Prioridade: P1
- Dependencias: UX-5
- Target: 25/02/2026
- Paralelizavel: sim (apos UX-5)

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Melhorar feedback visual com modal e barra de HP.

**Escopo:**
- Usar `src/ui/components/Modal.vue` no resultado
- Usar `src/ui/components/HealthBar.vue` nos cards

**Fora de escopo:**
- Animacoes complexas

**Regras arquiteturais:**
- UI apenas apresentacao

**Garantias do sistema:**
- HP visual reflete estado real

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Integrar `src/ui/components/HealthBar.vue` em `src/ui/components/PokemonCard.vue`.
2. Usar `src/ui/components/Modal.vue` para resultado final.

**Passos de implementacao:**
1. Passar `current` e `max` para `HealthBar`.
2. Usar modal com `open` e `@close`.

**Separacao de responsabilidades:**
- UI: visual

**Delegacao para squads:**
- Squad B: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Barra de HP atualiza ao receber dano.
- Modal abre/fecha corretamente.

**Condicoes de sucesso:**
- Validacao manual em fluxo completo.

**O que invalida a entrega:**
- HP fora de sincronia com estado.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
