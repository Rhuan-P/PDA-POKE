# Como Contribuir para PDA-POKE

## Metodologia DTF - Obrigatória

Este projeto segue rigorosamente a **Definição Técnica por Fases (DTF)**. Toda contribuição deve seguir:

### 🔹 DTR - Definição Técnica de Requisitos
Antes de qualquer código, crie uma issue com:
- **Objetivo técnico** claro
- **Escopo** delimitado
- **Fora de escopo** explícito
- **Regras arquiteturais** a seguir

### 🔹 DTI - Definição Técnica de Implementação
No PR, descreva:
- **Tasks técnicas** detalhadas
- **Passos de implementação**
- **Separação de responsabilidades**
- **Delegação** entre squads

### 🔹 DTA - Definição Técnica de Aceite
Para aprovação, inclua:
- **Critérios objetivos** de aceite
- **Condições de sucesso** verificáveis
- **O que invalida** a entrega

## Processo de Contribuição

### 1. Criação de Issue
- Use template DTF disponível
- Aguarde aprovação do Líder Técnico
- Issue aprovada = DTR definido

### 2. Desenvolvimento
- Crie branch `feature/nome-da-task`
- Implemente seguindo DTI aprovado
- Mantenha arquitetura limpa

### 3. Pull Request
- Use template DTF completo
- Inclua DTR, DTI e DTA
- Aguarde code review

### 4. Aprovação
- Revisão obrigatória do Líder Técnico
- Testes automatizados devem passar
- DTA verificado e aprovado

## Padrões de Código

### Nomenclatura
- **Classes:** PascalCase (BattleService, Player)
- **Métodos:** camelCase (executeAction, validateTurn)
- **Constantes:** UPPER_SNAKE_CASE (MAX_PLAYERS)
- **Arquivos:** kebab-case (battle-service.ts)

### Estrutura
- Imports no topo
- Classes com injeção de dependência
- Métodos públicos primeiro
- Testes unitários obrigatórios

## Branch Strategy

```
main           ← Produção (protegido)
develop        ← Desenvolvimento
feature/*       ← Features específicas
hotfix/*        ← Correções urgentes
```

## Regras Fundamentais

1. **Sem DTA, não existe entrega válida**
2. **Nada é implementado sem DTR aprovado**
3. **DTI só existe se houver DTR**
4. **Code review obrigatório para main**

## Ferramentas

- **Git:** Controle de versão
- **GitHub:** Issues, PRs e CI/CD
- **Notion:** Documentação e organização
- **TypeScript:** Desenvolvimento

## Contato

- **Líder Técnico:** Para aprovações DTR/DTA
- **Squads:** Para desenvolvimento colaborativo
- **DevOps:** Para infraestrutura e pipelines

---

**Lembre-se:** Qualidade e clareza antes de velocidade!
