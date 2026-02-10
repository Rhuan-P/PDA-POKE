# Diagrama Arquitetural - Jogo PVP

## Visão das Camadas

```
┌─────────────────────────────────────────┐
│              UI Layer              │
│  - Componentes visuais            │
│  - Event handlers                │
│  - Estado da interface            │
└─────────────┬───────────────────┘
              │ depende
┌─────────────▼───────────────────┐
│         Application Layer          │
│  - BattleService                │
│  - Orquestradores              │
│  - Casos de uso                │
└─────────────┬───────────────────┘
              │ depende
┌─────────────▼───────────────────┐
│          Domain Layer             │
│  - Entidades (Player, Skill)     │
│  - Regras de combate            │
│  - Validadores                 │
└─────────────┬───────────────────┘
              │ implementa
┌─────────────▼───────────────────┐
│      Infrastructure Layer         │
│  - WebSocket                   │
│  - Persistência                 │
│  - Configurações                │
└───────────────────────────────────┘
```

## Fluxo de Dados

1. **Usuário** clica em ação na **UI**
2. **Application** orquestra fluxo via **BattleService**
3. **Domain** valida regras e atualiza estado
4. **Infrastructure** persiste e comunica via WebSocket
5. **UI** atualiza apresentação com novo estado

## Dependências Permitidas

- **UI** → **Application** (via interfaces)
- **Application** → **Domain** (via interfaces)  
- **Infrastructure** → **Domain** (implementa interfaces)
- **Application** → **Infrastructure** (via interfaces)

## Responsabilidades por Camada

### UI Layer
- Renderizar componentes visuais
- Capturar eventos do usuário
- Manter estado local da interface
- Exibir feedback de ações

### Application Layer  
- Orquestrar fluxos de batalha
- Coordinar entre camadas
- Implementar casos de uso
- Gerenciar estado da aplicação

### Domain Layer
- Conter regras de negócio puras
- Validar estados e ações
- Calcular resultados de combate
- Definir entidades do jogo

### Infrastructure Layer
- Implementar comunicação WebSocket
- Gerenciar persistência de dados
- Prover configurações técnicas
- Interface com serviços externos

## Pontos de Extensão

- **Novas habilidades**: Apenas Domain Layer
- **Novas UIs**: UI + Application Layers
- **Novas integrações**: Apenas Infrastructure Layer  
- **Novas regras**: Apenas Domain Layer

## Garantias da Arquitetura

- **Modularidade**: Cada camada evolui independentemente
- **Testabilidade**: Isolamento facilita testes unitários
- **Escalabilidade**: Separação permite escala horizontal
- **Manutenibilidade**: Responsabilidades claras reduzem bugs
