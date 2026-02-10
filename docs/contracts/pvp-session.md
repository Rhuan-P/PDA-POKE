# PvpSession (Sessão PVP)

## Objetivo
Gerenciar conexão e comunicação entre dois jogadores em batalha

## Responsabilidade
Coordenar sessão PVP desde matchmaking até fim da partida

## Campos Mínimos

```typescript
interface PvpSession {
  id: string;                    // identificador único da sessão
  player1Id: string;              // ID do primeiro jogador
  player2Id: string;              // ID do segundo jogador
  gameState: GameState;           // estado atual da partida
  status: 'waiting' | 'active' | 'disconnected' | 'finished';  // status da sessão
  createdAt: Date;               // momento de criação
  lastActivity: Date;             // última atividade para timeout
  roomId?: string;                // ID da sala WebSocket (opcional)
}
```

## Limites de Conhecimento

- **Não sabe** regras do jogo
- **Não sabe** validar ações
- **Não sabe** determinar vencedor
- **Apenas gerencia** conexão e estado

## Métodos Esperados

```typescript
class PvpSession {
  // Gerenciamento de sessão
  startSession(): void;
  endSession(winnerId: string): void;
  disconnectPlayer(playerId: string): void;
  
  // Consultas de estado
  isFull(): boolean;
  isActive(): boolean;
  hasPlayer(playerId: string): boolean;
  getOpponent(playerId: string): string | null;
  
  // Timeout e limpeza
  updateLastActivity(): void;
  isExpired(timeoutMinutes: number): boolean;
  
  // Serialização
  toJSON(): object;
  static fromJSON(data: object): PvpSession;
}
```

## Validações

- ID não pode ser vazio
- Player1Id e Player2Id não podem ser iguais
- GameState deve ser válido
- Status deve ser um dos valores permitidos

## Fluxos de Sessão

### waiting
- Sala criada, aguardando segundo jogador
- Player1 conectado, Player2 pendente
- Timeout de 30 segundos para cancelar

### active
- Ambos jogadores conectados
- GameState em modo 'playing'
- Comunicação via WebSocket ativa

### disconnected
- Um ou ambos jogadores perderam conexão
- Sessão marcada para limpeza
- Possibilidade de reconexão

### finished
- Partida concluída com vencedor
- GameState em modo 'finished'
- Sessão pronta para arquivamento

## Regras Arquiteturais

- PvpSession pertence à **Domain Layer**
- Não depende de implementações de WebSocket
- Estado gerenciado por Infrastructure
- Pode ser persistido para recuperação

## Integrações

- **WebSocket Manager**: Gerencia conexões reais
- **Matchmaking Service**: Cria novas sessões
- **Game Repository**: Persiste sessões ativas
- **Timeout Service**: Limpa sessões inativas
