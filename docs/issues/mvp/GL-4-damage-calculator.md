# [GL-4] DamageCalculator

## Metadados
- ID: GL-4
- Squad: Game Logic
- Prioridade: P0
- Dependencias: GL-2, GL-3
- Target: 17/02/2026
- Paralelizavel: sim (apos GL-2/GL-3)

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Implementar calculo de dano com stats, tipo e skill (MVP).

**Escopo:**
- `DamageCalculator.calculate` usando `power` da skill
- Opcional: STAB e critico simplificados

**Fora de escopo:**
- RNG complexo
- Status effects

**Regras arquiteturais:**
- Funcoes puras
- Sem IO

**Garantias do sistema:**
- Dano minimo 1
- Dano deterministico para inputs iguais

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar formula base em `src/domain/calculators/DamageCalculator.ts`.
2. Integrar efetividade de tipo.
3. Ajustar STAB se aplicavel.

**Passos de implementacao:**
1. Definir formula base: (attack/defense) * power (skill).
2. Aplicar multiplicadores de tipo.
3. Aplicar STAB (1.5) quando tipo do ataque igual ao do pokemon.
4. Garantir floor e minimo 1.

**Separacao de responsabilidades:**
- `DamageCalculator`: calculo completo
- `STABCalculator`: apenas multiplicador

**Delegacao para squads:**
- Squad A: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- Dano positivo para valores validos.
- STAB aplicado apenas quando devido.
- Multiplicador de tipo aplicado.

**Condicoes de sucesso:**
- Testes deterministas cobrindo pelo menos 5 cenarios.

**O que invalida a entrega:**
- Dano zero para inputs validos.
- Uso de random.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
