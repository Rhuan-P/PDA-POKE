# Player (Jogador)

## Objetivo
Representar um participante da batalha PVP

## Responsabilidade
Manter estado completo do jogador durante a partida

## Campos Mínimos

```typescript
interface Player {
  id: string;                    // identificador único do jogador
  name: string;                  // nome visível na interface
  health: number;                 // vida atual
  maxHealth: number;               // vida máxima
  attack: number;                 // poder de ataque base
  defense: number;                 // poder de defesa base
  speed: number;                  // velocidade (iniciativa)
  skills: Skill[];                // habilidades disponíveis
  status: 'active' | 'defeated' | 'waiting';  // estado na partida
  lastActionTime?: number;         // timestamp da última ação
  position?: { x: number; y: number }; // posição no campo (futuro)
}
```

## Limites de Conhecimento

- **Não sabe** executar ações
- **Não sabe** validar turno
- **Não sabe** calcular dano
- **Apenas mantém** estado atual

## Métodos Esperados

```typescript
class Player {
  // Consultas de estado
  isAlive(): boolean;
  isDefeated(): boolean;
  canAct(currentTime: number): boolean;
  
  // Modificações de estado
  takeDamage(damage: number): void;
  heal(amount: number): void;
  useSkill(skillId: string): boolean;
  
  // Habilidades
  getAvailableSkills(): Skill[];
  hasSkill(skillId: string): boolean;
  
  // Serialização
  toJSON(): object;
  static fromJSON(data: object): Player;
}
```

## Validações

- ID não pode ser vazio
- Name deve ter entre 2 e 30 caracteres
- Health deve estar entre 0 e maxHealth
- MaxHealth deve ser > 0
- Stats devem ser >= 0
- Skills não pode ser vazio

## Status do Jogador

### active
- Jogador participando ativamente da batalha
- Pode executar ações
- Saúde > 0

### defeated  
- Jogador derrotado na batalha
- Não pode executar ações
- Saúde = 0

### waiting
- Jogador aguardando início da batalha
- Ainda não pode executar ações
- Estado inicial

## Exemplo de Jogador (MVP)

```typescript
{
  id: "player_001",
  name: "Guerreiro",
  health: 100,
  maxHealth: 100,
  attack: 15,
  defense: 10,
  speed: 12,
  skills: [
    {
      id: "sword_attack",
      name: "Sword Attack",
      type: "damage",
      power: 20,
      cooldown: 1,
      description: "Ataque básico com espada",
      accuracy: 90,
      target: "enemy"
    }
  ],
  status: "active"
}
```

## Regras Arquiteturais

- Player pertence à **Domain Layer**
- Estado imutável (métodos retornam novas instâncias)
- Serializável para persistência e WebSocket
- Não contém lógica de negócio complexa
