# [GL-1] Entidade Pokemon

## Metadados
- ID: GL-1
- Squad: Game Logic
- Prioridade: P0
- Dependencias: nenhuma
- Target: 17/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Implementar a entidade Pokemon com validacoes e metodos puros para uso em batalhas.

**Escopo:**
- Interface e modelo Pokemon
- Metodos create, takeDamage, isDefeated
- Validacoes de entrada

**Fora de escopo:**
- Integracao com APIs
- Persistencia
- Lógica de turno

**Regras arquiteturais:**
- Dominio puro (sem IO)
- Imutabilidade
- Sem dependencias externas

**Garantias do sistema:**
- Pokemon sempre valido
- Metodos sem efeitos colaterais

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar interface e modelo em `src/domain/entities/Pokemon.ts`.
2. Adicionar validacoes de nome, nivel e stats.
3. Garantir imutabilidade no `takeDamage`.

**Passos de implementacao:**
1. Definir interface `Pokemon` e `PokemonStats`.
2. Implementar `PokemonModel.create(name, level)` gerando stats default coerentes.
3. Implementar `PokemonModel.takeDamage(pokemon, damage)` retornando novo objeto.
4. Implementar `PokemonModel.isDefeated(pokemon)` com hp <= 0.
5. Atualizar/garantir re-export em `src/domain/models/Pokemon.ts` (compatibilidade).

**Separacao de responsabilidades:**
- `PokemonModel`: criacao e regras base da entidade.
- `PokemonStats`: dados de estado, sem logica.

**Delegacao para squads:**
- Squad A: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- `PokemonModel.create` valida entradas invalidas.
- `takeDamage` nao muta o objeto original.
- `isDefeated` retorna true quando hp <= 0.

**Condicoes de sucesso:**
- Testes unitarios cobrindo criacao, dano e derrota.
- Tipagem sem `any`.

**O que invalida a entrega:**
- Mutacao do objeto original.
- Dependencias externas (fetch, console, Date).

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
