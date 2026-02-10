# Action (Ação do Jogador)

## Objetivo
Representar uma ação que um jogador pode executar durante a batalha

## Responsabilidade
Definir estrutura de uma ação de forma padronizada

## Campos Mínimos

```typescript
interface Action {
  id: string;                    // identificador único da ação
  playerId: string;                // quem executou a ação
  type: 'attack' | 'defend' | 'skill' | 'item';  // tipo da ação
  targetId: string | null;       // alvo da ação (se aplicável)
  skillId: string | null;         // habilidade usada (se aplicável)
  timestamp: number;               // momento da ação em ms
  priority: number;                // prioridade na fila (menor = primeiro)
  metadata?: Record<string, any>;   // dados extras específicos
}
```

## Limites de Conhecimento

- **Não sabe** executar a ação
- **Não sabe** validar se é legal
- **Não sabe** calcular resultados
- **Apenas representa** intenção do jogador

## Métodos Esperados

```typescript
class Action {
  // Validações básicas
  isValid(): boolean;
  hasTarget(): boolean;
  requiresSkill(): boolean;
  
  // Comparações
  equals(other: Action): boolean;
  
  // Serialização
  toJSON(): object;
  static fromJSON(data: object): Action;
}
```

## Validações

- ID não pode ser vazio
- PlayerId deve ser válido
- Type deve ser um dos valores permitidos
- Timestamp deve ser positivo
- Priority deve ser >= 0

## Tipos de Ação (MVP)

### attack
- Requer targetId
- Causa dano baseado em stats do jogador
- Prioridade normal

### defend
- Não requer targetId
- Aumenta defesa no turno atual
- Prioridade alta

### skill
- Requer skillId e targetId
- Usa sistema de cooldown
- Prioridade baseada na skill

## Regras Arquiteturais

- Action pertence à **Domain Layer**
- Não depende de UI ou Infrastructure
- Deve ser serializável para WebSocket
- Imutável após criação
