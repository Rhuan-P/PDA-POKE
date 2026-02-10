# Skill (Habilidade)

## Objetivo
Definir características e dados de uma habilidade do jogo

## Responsabilidade
Armazenar dados estáticos de habilidades de forma estruturada

## Campos Mínimos

```typescript
interface Skill {
  id: string;                    // identificador único
  name: string;                  // nome visível ao jogador
  type: 'damage' | 'heal' | 'buff' | 'debuff';  // tipo principal
  power: number;                 // potência base da habilidade
  cooldown: number;                // turnos para recarregar
  description: string;             // descrição da habilidade
  cost?: number;                  // custo de mana/energia (opcional MVP)
  accuracy: number;                // chance de acerto (0-100)
  target: 'self' | 'enemy' | 'all';  // quem pode ser afetado
}
```

## Limites de Conhecimento

- **Não sabe** calcular dano
- **Não sabe** aplicar efeitos
- **Não sabe** gerenciar cooldown
- **Apenas dados** estáticos da habilidade

## Métodos Esperados

```typescript
class Skill {
  // Consultas
  isReady(lastUsed: number, currentTurn: number): boolean;
  getCooldownRemaining(lastUsed: number, currentTurn: number): number;
  
  // Validações
  isValid(): boolean;
  
  // Serialização
  toJSON(): object;
  static fromJSON(data: object): Skill;
}
```

## Validações

- ID não pode ser vazio
- Name deve ter entre 3 e 50 caracteres
- Type deve ser um dos valores permitidos
- Power deve ser >= 0
- Cooldown deve ser >= 0
- Accuracy deve estar entre 0 e 100

## Exemplos de Habilidades (MVP)

### Fire Blast
```typescript
{
  id: "fire_blast_001",
  name: "Fire Blast",
  type: "damage",
  power: 25,
  cooldown: 2,
  description: "Lança uma rajada de fogo no inimigo",
  accuracy: 85,
  target: "enemy"
}
```

### Heal
```typescript
{
  id: "heal_001", 
  name: "Heal",
  type: "heal",
  power: 20,
  cooldown: 3,
  description: "Recupera vida do usuário",
  accuracy: 100,
  target: "self"
}
```

### Iron Defense
```typescript
{
  id: "iron_defense_001",
  name: "Iron Defense", 
  type: "buff",
  power: 15,
  cooldown: 4,
  description: "Aumenta defesa por 2 turnos",
  accuracy: 100,
  target: "self"
}
```

## Regras Arquiteturais

- Skill pertence à **Domain Layer**
- Dados imutáveis após criação
- Pode ser carregado de configurações externas
- Não contém lógica de execução
