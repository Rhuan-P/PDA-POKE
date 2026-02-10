# GameState (Estado da Partida)

## Objetivo
Representar o estado completo de uma batalha em andamento

## Responsabilidade
Manter estado consistente da partida PVP

## Campos Mínimos

```typescript
interface GameState {
  id: string;                    // identificador único da partida
  players: Player[];              // jogadores na partida
  currentTurn: number;            // turno atual
  phase: 'setup' | 'playing' | 'finished';  // fase da partida
  winner: string | null;         // id do vencedor
  createdAt: Date;               // momento de criação
  updatedAt: Date;               // última atualização
}
```

## Limites de Conhecimento

- **Não sabe** regras de combate
- **Não sabe** executar ações
- **Não sabe** validar se ações são legais
- **Apenas armazena** estado atual

## Métodos Esperados

```typescript
class GameState {
  // Transições de estado
  transitionToPlaying(): void;
  transitionToFinished(winnerId: string): void;
  
  // Atualizações
  addPlayer(player: Player): void;
  removePlayer(playerId: string): void;
  updateTurn(): void;
  
  // Consultas
  isPlayerTurn(playerId: string): boolean;
  getCurrentPlayer(): Player | null;
  isFinished(): boolean;
}
```

## Validações

- ID não pode ser vazio
- Deve ter entre 2 e 2 jogadores (para MVP)
- Phase deve seguir valores permitidos
- Winner só pode existir se phase for 'finished'

## Regras Arquiteturais

- GameState pertence à **Domain Layer**
- Não depende de implementações de Infrastructure
- Pode ser serializado para persistência
- Deve ser imutável para mudanças de estado
