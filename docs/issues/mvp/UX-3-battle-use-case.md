# [UX-3] BattleUseCase

## Metadados
- ID: UX-3
- Squad: User Experience
- Prioridade: P0
- Dependencias: GL-4, UX-1
- Target: 20/02/2026
- Paralelizavel: sim (apos GL-4 e UX-1)

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Orquestrar ataques usando Domain + Services + State.

**Escopo:**
- `BattleUseCase.executeAttack`
- Interfaces `IPokemonService`, `IDamageCalculator`, `IBattleStore`

**Fora de escopo:**
- UI
- Persistencia

**Regras arquiteturais:**
- Application nao faz logica de negocio
- Usa Domain para dano

**Garantias do sistema:**
- Dano aplicado no store

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar `BattleUseCase`.
2. Definir contratos de dependencias.
3. Testes com mocks (service, calculator, store).

**Passos de implementacao:**
1. Buscar attacker/defender via service.
2. Buscar skill via service (stub ok).
3. Calcular dano com calculator.
4. Aplicar dano via store.

**Separacao de responsabilidades:**
- Use case: orquestracao
- Calculator: regra
- Store: estado

**Delegacao para squads:**
- Squad B: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- `executeAttack` chama todas dependencias.
- Dano aplicado no `IBattleStore`.

**Condicoes de sucesso:**
- Teste com mocks passa.

**O que invalida a entrega:**
- Logica de dano implementada no use case.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
