# Diagrama Arquitetural - PDA-POKE

## Visao das Camadas

```
┌─────────────────────────────────────────┐
│              UI Layer                   │
│  - Componentes visuais                  │
│  - Event handlers                       │
│  - Views                                │
└─────────────┬───────────────────────────┘
              │ depende
┌─────────────▼───────────────────────────┐
│             State Layer                 │
│  - Estado reativo (Pinia)               │
│  - Getters e actions                    │
└─────────────┬───────────────────────────┘
              │ chama
┌─────────────▼───────────────────────────┐
│          Application Layer              │
│  - Use cases                            │
│  - Orquestracao                         │
│  - Interfaces                           │
└─────────────┬───────────────────────────┘
              │ usa
      ┌───────▼─────────┐   ┌────────────────┐
      │  Domain Layer   │   │ Services Layer │
      │  - Regras puras │   │ - APIs externas│
      │  - Entidades    │   │ - Cache/Erros  │
      └─────────────────┘   └────────────────┘
```

## Fluxo de Dados (Referencia)

1. UI dispara evento
2. State chama Application (use cases)
3. Application consulta Services e Domain
4. Application atualiza State
5. UI reage ao State

## Dependencias Permitidas

- UI -> State
- State -> Application
- Application -> Domain
- Application -> Services
- Domain e Services nao dependem de outras camadas

## Responsabilidades por Camada

### UI Layer
- Renderizar componentes visuais
- Capturar eventos do usuario

### State Layer
- Centralizar estado reativo
- Actions sem logica de negocio

### Application Layer
- Orquestrar fluxos
- Coordenar Domain e Services

### Domain Layer
- Regras de negocio puras
- Entidades e validacoes

### Services Layer
- Comunicacao com APIs externas
- Normalizacao e erros
