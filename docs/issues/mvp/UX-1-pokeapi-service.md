# [UX-1] PokeApiService + cache

## Metadados
- ID: UX-1
- Squad: User Experience
- Prioridade: P0
- Dependencias: nenhuma
- Target: 17/02/2026
- Paralelizavel: sim

## DTR - Definicao Tecnica de Requisitos

**Objetivo tecnico:** Implementar comunicacao com PokeAPI com cache e tratamento de erros.

**Escopo:**
- `fetchPokemon`, `searchPokemon`, `getPokemonList`
- Cache com TTL
- Normalizacao de dados

**Fora de escopo:**
- Regras de negocio
- Persistencia local

**Regras arquiteturais:**
- Services sem dependencias de UI
- Sem logica de dominio

**Garantias do sistema:**
- Respostas normalizadas
- Erros tratados

---

## DTI - Definicao Tecnica de Implementacao

**Tasks tecnicas:**
1. Implementar `src/services/pokeApiService.js`.
2. Implementar `src/services/api-client.js` e `src/services/error-handler.js`.
3. Implementar cache em `src/services/utils/cache.js`.
4. Implementar normalizacao em `src/services/utils/data-transformer.js`.

**Passos de implementacao:**
1. Criar cliente HTTP generico.
2. Tratar erros de status HTTP.
3. Implementar cache com TTL (5 min).
4. Normalizar dados para formato do Domain.

**Separacao de responsabilidades:**
- `api-client`: fetch
- `error-handler`: erros
- `cache`: TTL
- `pokeApiService`: orquestracao

**Delegacao para squads:**
- Squad B: implementacao completa.

---

## DTA - Definicao Tecnica de Aceite

**Criterios objetivos de aceite:**
- `fetchPokemon` retorna objeto normalizado.
- Cache evita chamadas repetidas.
- Erros HTTP geram excecao clara.

**Condicoes de sucesso:**
- Testes com mocks de API.

**O que invalida a entrega:**
- Fetch direto em UI/State.
- Dados retornados sem normalizacao.

---

## Validacao
- [ ] Revisao de codigo concluida
- [ ] Testes automatizados implementados
- [ ] Documentacao atualizada
- [ ] DTA verificado e aprovado
