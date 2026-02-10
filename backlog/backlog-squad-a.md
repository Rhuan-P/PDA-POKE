# Backlog Squad A - Domain / Engine

## Task 1: Implementar GameState

### 🔹 DTR - Definição Técnica de Requisitos
**Objetivo técnico:** Criar gerenciador central de estado da partida com validações e transições

**Escopo:** Classe GameState completa com métodos de transição, validação e serialização

**Fora de escopo:** Persistência específica ou detalhes de rede

**Regras arquiteturais:** Imutabilidade de estado e validações de negócio

**Garantias do sistema:** Estado sempre válido e consistente durante partida

---

### 🔹 DTI - Definição Técnica de Implementação
**Tasks técnicas:**
1. Implementar classe GameState com campos mínimos
2. Adicionar métodos de transição de estado
3. Criar validadores de estado
4. Implementar serialização/deserialização

**Passos de implementação:**
1. Criar interface GameState em /src/domain/interfaces
2. Implementar classe GameState em /src/domain/entities
3. Adicionar métodos: transitionToPlaying(), transitionToFinished()
4. Implementar validações: isPlayerTurn(), isFinished()
5. Adicionar serialização JSON para persistência

**Separação de responsabilidades:**
- GameState: Manter estado e transições
- Validadores: Garantir consistência das regras
- Squad A: Implementar toda lógica de domínio

---

### 🔹 DTA - Definição Técnica de Aceite
**Critérios objetivos de aceite:**
- GameState criado com todos os campos obrigatórios
- Transições de estado funcionando corretamente
- Validações impedindo estados inválidos
- Serialização funcional para persistência

**Condições de sucesso:**
- Instância de GameState criada sem erros
- Métodos de transição testados unitariamente
- Estado serializável e desserializável
- Todas as validações implementadas

**O que invalida a entrega:**
- Estado mutável (modificações diretas)
- Falta de validações de consistência
- Serialização quebrada ou incompleta
- Transições que permitem estados inválidos

---

## Task 2: Implementar Action System

### 🔹 DTR - Definição Técnica de Requisitos
**Objetivo técnico:** Criar sistema completo de ações dos jogadores com validação e priorização

**Escopo:** Sistema de ações com fila, priorização e validação básica

**Fora de escopo:** Execução de ações ou cálculo de resultados

**Regras arquiteturais:** Imutabilidade de ações e validações de integridade

**Garantias do sistema:** Ações sempre válidas e ordenadas corretamente

---

### 🔹 DTI - Definição Técnica de Implementação
**Tasks técnicas:**
1. Implementar classe Action com campos mínimos
2. Criar sistema de fila de ações por turno
3. Adicionar validadores de integridade
4. Implementar sistema de priorização

**Passos de implementação:**
1. Criar interface Action em /src/domain/interfaces
2. Implementar classe Action em /src/domain/entities
3. Criar ActionQueue para gerenciar fila por turno
4. Implementar validações: isValid(), hasTarget()
5. Adicionar sistema de priorização com campo priority

**Separação de responsabilidades:**
- Action: Representar intenção do jogador
- ActionQueue: Gerenciar ordem de execução
- Squad A: Implementar toda lógica de ações

---

### 🔹 DTA - Definição Técnica de Aceite
**Critérios objetivos de aceite:**
- Action criada com todos os campos obrigatórios
- Sistema de fila funcionando com priorização
- Validações impedindo ações inválidas
- Fila ordenada corretamente por prioridade

**Condições de sucesso:**
- Instância de Action criada sem erros
- ActionQueue processando ações em ordem
- Validações verificando integridade dos dados
- Priorização respeitando campo priority

**O que invalida a entrega:**
- Ações mutáveis após criação
- Fila sem ordenação por prioridade
- Falta de validações de integridade
- Sistema permitindo ações inválidas

---

## Task 3: Implementar Skill Engine

### 🔹 DTR - Definição Técnica de Requisitos
**Objetivo técnico:** Criar motor de habilidades com sistema de cooldown e validações

**Escopo:** Skill Engine completo com gerenciamento de cooldown e validações de uso

**Fora de escopo:** Cálculo de dano ou aplicação de efeitos

**Regras arquiteturais:** Dados imutáveis e validações de uso

**Garantias do sistema:** Habilidades sempre válidas e cooldown funcionando

---

### 🔹 DTI - Definição Técnica de Implementação
**Tasks técnicas:**
1. Implementar classe Skill com dados básicos
2. Criar sistema de gerenciamento de cooldown
3. Adicionar validadores de uso de habilidades
4. Implementar Skill Registry para catalogar habilidades

**Passos de implementação:**
1. Criar interface Skill em /src/domain/interfaces
2. Implementar classe Skill em /src/domain/entities
3. Criar CooldownManager para controlar recargas
4. Implementar validações: isReady(), canUse()
5. Adicionar SkillRegistry com habilidades básicas MVP

**Separação de responsabilidades:**
- Skill: Dados estáticos da habilidade
- CooldownManager: Controle de tempo de espera
- Squad A: Implementar toda lógica de habilidades

---

### 🔹 DTA - Definição Técnica de Aceite
**Critérios objetivos de aceite:**
- Skill criada com todos os campos obrigatórios
- Sistema de cooldown funcionando corretamente
- Validações impedindo uso indevido
- Registry com habilidades básicas cadastradas

**Condições de sucesso:**
- Instância de Skill criada sem erros
- CooldownManager controlando tempos de espera
- Habilidades validadas antes do uso
- Registry populado com habilidades MVP

**O que invalida a entrega:**
- Habilidades com dados mutáveis
- Cooldown não funcionando ou sendo ignorado
- Falta de validações de uso
- Registry vazio ou incompleto

---

## Regras do Backlog Squad A

- **Domínio puro:** Nenhuma dependência de Infrastructure ou UI
- **Testabilidade:** Todas as classes devem ser unitariamente testáveis
- **Validação forte:** Todas as entidades devem validar seu estado
- **Performance:** Operações O(1) para consultas e validações
