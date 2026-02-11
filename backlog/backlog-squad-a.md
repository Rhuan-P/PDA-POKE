# Backlog Squad A - Time Game Logic

## VisÃ£o Geral

**Squad:** Time Game Logic  
**Responsabilidade:** Implementar regras de negÃ³cio puras do PokÃ©mon Battle Simulator  
**Stack:** TypeScript puro, sem dependÃªncias externas  
**Arquivos foco:** `src/domain/`

## Objetivo da Squad

Criar toda a lÃ³gica de negÃ³cio do simulador de batalhas PokÃ©mon:
- Entidades e modelos de dados
- Regras de cÃ¡lculo de dano
- Sistema de batalha completo
- ValidaÃ§Ãµes e constantes

---

## Task 1: Implementar Core Domain Entities

### DTR - DefiniÃ§Ã£o TÃ©cnica de Requisitos
**Objetivo tÃ©cnico:** Criar entidades centrais do domÃ­nio com validaÃ§Ãµes e regras de negÃ³cio puras

**Escopo:** Entidades Pokemon, Skill, Battle com cÃ¡lculos de dano e eficÃ¡cia

**Fora de escopo:** ComunicaÃ§Ã£o com APIs, estado da UI, persistÃªncia

**Regras arquiteturais:** TypeScript puro, sem dependÃªncias externas, testabilidade unitÃ¡ria

**Garantias do sistema:** Entidades sempre vÃ¡lidas e cÃ¡lculos precisos

---

### DTI - DefiniÃ§Ã£o TÃ©cnica de ImplementaÃ§Ã£o
**Tasks tÃ©cnicas:**

#### 1.1 Implementar entidade Pokemon
**Arquivo:** `src/domain/entities/Pokemon.ts`
**ResponsÃ¡vel:** Time Game Logic

**ImplementaÃ§Ã£o:**
- Interface `Pokemon` com propriedades bÃ¡sicas
- Classe `PokemonModel` com mÃ©todos estÃ¡ticos
- ValidaÃ§Ãµes de dados de entrada
- MÃ©todos de negÃ³cio puros

**MÃ©todos obrigatÃ³rios:**
```typescript
static create(name: string, level: number): Pokemon
static takeDamage(pokemon: Pokemon, damage: number): Pokemon  
static isDefeated(pokemon: Pokemon): boolean
```

**Regras de ouro:**
- Imutabilidade: mÃ©todos retornam novas instÃ¢ncias
- ValidaÃ§Ãµes: nome nÃ£o vazio, nÃ­vel > 0
- TypeScript: tipagem forte em todas as propriedades
- Proibido: fetch, console, DOM, Vue

#### 1.2 Implementar serviÃ§o de batalha
**Arquivo:** `src/domain/services/battleService.ts`
**ResponsÃ¡vel:** Time Game Logic

**ImplementaÃ§Ã£o:**
- Interface `BattleResult` para resultado
- Classe `BattleService` com lÃ³gica pura
- CÃ¡lculo de dano baseado em stats
- Sistema de turnos baseado em velocidade

**MÃ©todos obrigatÃ³rios:**
```typescript
static calculateDamage(attacker: Pokemon, defender: Pokemon): number
static getTurnOrder(pokemon1: Pokemon, pokemon2: Pokemon): [Pokemon, Pokemon]
static simulateBattle(pokemon1: Pokemon, pokemon2: Pokemon): BattleResult
static getWinner(pokemon1: Pokemon, pokemon2: Pokemon): Pokemon | null
```

**Regras de ouro:**
- FÃ³rmulas documentadas nos comentÃ¡rios
- CÃ¡lculo de eficÃ¡cia de tipo
- ValidaÃ§Ã£o de parÃ¢metros
- Proibido: estado global, efeitos colaterais

#### 1.3 Implementar utilitÃ¡rios de cÃ¡lculo
**Arquivo:** `src/domain/utils/StatCalculator.ts`
**ResponsÃ¡vel:** Time Game Logic

**ImplementaÃ§Ã£o:**
- Interface `StatCalculation` para contexto
- Classe `StatCalculator` com funÃ§Ãµes puras
- CÃ¡lculos baseados em nÃ­vel
- Modificadores de status

**MÃ©todos obrigatÃ³rios:**
```typescript
static calculateByLevel(baseStat: number, level: number): number
static calculateAllStats(baseStats: PokemonStats, level: number): PokemonStats
static applyModifiers(stats: PokemonStats, modifiers: Partial<PokemonStats>): PokemonStats
static getTypeAdvantage(attackerType: string, defenderType: string): number
```

**Regras de ouro:**
- FunÃ§Ãµes puras (mesmo input â†’ mesmo output)
- Sem efeitos colaterais
- DocumentaÃ§Ã£o de fÃ³rmulas
- Proibido: random, data externa, estado

---

### DTA - DefiniÃ§Ã£o TÃ©cnica de Aceite
**CritÃ©rios objetivos de aceite:**

#### 1.1 Testes UnitÃ¡rios
- [ ] Todos os mÃ©todos de `PokemonModel` testados
- [ ] Cobertura > 90% para entidades
- [ ] Testes de validaÃ§Ã£o de entrada
- [ ] Testes de imutabilidade

#### 1.2 Testes de Batalha
- [ ] `calculateDamage` com casos de borda
- [ ] `getTurnOrder` com diferentes velocidades
- [ ] `simulateBattle` completa com logs
- [ ] ValidaÃ§Ã£o de vitÃ³ria/derrota

#### 1.3 Testes de CÃ¡lculos
- [ ] `calculateByLevel` com mÃºltiplos nÃ­veis
- [ ] `getTypeAdvantage` com matriz de tipos
- [ ] `applyModifiers` com buffs/debuffs
- [ ] Performance dos cÃ¡lculos

#### 1.4 Qualidade de CÃ³digo
- [ ] TypeScript sem erros `any`
- [ ] ESLint sem warnings
- [ ] ComentÃ¡rios explicando fÃ³rmulas
- [ ] Nomenclatura consistente

#### 1.5 DocumentaÃ§Ã£o
- [ ] JSDoc em todos os mÃ©todos pÃºblicos
- [ ] Exemplos de uso nos comentÃ¡rios
- [ ] README da camada com exemplos
- [ ] Arquitetura respeitada

---

## Task 2: Implementar Sistema de Habilidades

### DTR - DefiniÃ§Ã£o TÃ©cnica de Requisitos
**Objetivo tÃ©cnico:** Criar sistema de habilidades e ataques dos PokÃ©mons
1. Criar interfaces em `/src/domain/interfaces/`
   - `IDamageCalculator.ts` - interface principal
   - `IDamageFormula.ts` - parÃ¢metros da fÃ³rmula
2. Implementar classes em `/src/domain/calculators/`
   - `DamageCalculator.ts` - cÃ¡lculo principal
   - `STABCalculator.ts` - bÃ´nus de mesmo tipo
   - `CriticalHitCalculator.ts` - sistema de crÃ­ticos
3. Criar constantes em `/src/domain/constants/`
   - `DamageConstants.ts` - valores oficiais
   - `TypeChart.ts` - matriz de eficÃ¡cia

**SeparaÃ§Ã£o de responsabilidades:**
- DamageCalculator: Orquestrar cÃ¡lculo completo
- STABCalculator: Calcular bÃ´nus de tipo
- CriticalHitCalculator: Gerenciar crÃ­ticos
- Squad A: Implementar toda matemÃ¡tica de combate

---

### ðŸ”¹ DTA - DefiniÃ§Ã£o TÃ©cnica de Aceite
**CritÃ©rios objetivos de aceite:**
- FÃ³rmula de dano implementada corretamente
- STAB aplicado quando apropriado
- CrÃ­ticos calculados com probabilidade correta
- EficÃ¡cia de tipos aplicada corretamente

**CondiÃ§Ãµes de sucesso:**
- Dano calculado matches fÃ³rmula oficial
- STAB = 1.5 quando tipo do ataque = tipo do pokÃ©mon
- CrÃ­ticos com 6.25% de chance (padrÃ£o)
- Super efetivo (2x), nÃ£o efetivo (0.5x), imune (0x)

**O que invalida a entrega:**
- FÃ³rmula de dano incorreta
- STAB nÃ£o implementado
- Probabilidade de crÃ­ticos errada
- Matriz de tipos incompleta

---

## Regras do Backlog Squad A

### ðŸŽ¯ **Foco Principal**
- **Regras puras:** Nenhuma dependÃªncia de outras camadas
- **PrecisÃ£o matemÃ¡tica:** CÃ¡lculos exatos como nos jogos oficiais
- **ValidaÃ§Ã£o forte:** Entidades sempre em estado vÃ¡lido
- **Testabilidade:** 100% de cobertura unitÃ¡ria possÃ­vel

### ðŸš« **ProibiÃ§Ãµes Estritas**
- **ZERO dependÃªncias:** Sem importar Vue, APIs, DOM
- **ZERO side effects:** Sem console.log, fetch, localStorage
- **ZERO mutaÃ§Ã£o:** Estado imutÃ¡vel sempre que possÃ­vel
- **ZERO acoplamento:** Classes independentes e coesas

### âœ… **PadrÃµes ObrigatÃ³rios**
- **TypeScript strict:** Todas as validaÃ§Ãµes de tipo
- **Imutabilidade:** Objetos imutÃ¡veis apÃ³s criaÃ§Ã£o
- **Pure functions:** FunÃ§Ãµes sem side effects
- **SOLID:** PrincÃ­pios de design orientado a objetos

### ðŸ“Š **MÃ©tricas de Qualidade**
- **Cyclomatic complexity:** < 10 por mÃ©todo
- **Test coverage:** 100% para regras crÃ­ticas
- **Performance:** O(1) para validaÃ§Ãµes comuns
- **Memory:** Sem memory leaks em cÃ¡lculos

---

## Estrutura de Arquivos Esperada

```
src/domain/
â”œâ”€â”€ interfaces/
â”‚   â”œâ”€â”€ IPokemon.ts
â”‚   â”œâ”€â”€ ISkill.ts
â”‚   â”œâ”€â”€ IBattle.ts
â”‚   â”œâ”€â”€ ITurnManager.ts
â”‚   â”œâ”€â”€ IActionValidator.ts
â”‚   â”œâ”€â”€ IVictoryConditions.ts
â”‚   â””â”€â”€ index.ts
â”œâ”€â”€ entities/
â”‚   â”œâ”€â”€ Pokemon.ts
â”‚   â”œâ”€â”€ Skill.ts
â”‚   â””â”€â”€ Battle.ts
â”œâ”€â”€ rules/
â”‚   â”œâ”€â”€ TurnManager.ts
â”‚   â”œâ”€â”€ ActionValidator.ts
â”‚   â””â”€â”€ VictoryConditions.ts
â”œâ”€â”€ calculators/
â”‚   â”œâ”€â”€ DamageCalculator.ts
â”‚   â”œâ”€â”€ STABCalculator.ts
â”‚   â””â”€â”€ CriticalHitCalculator.ts
â”œâ”€â”€ utils/
â”‚   â”œâ”€â”€ TypeEffectiveness.ts
â”‚   â””â”€â”€ StatCalculator.ts
â”œâ”€â”€ constants/
â”‚   â”œâ”€â”€ DamageConstants.ts
â”‚   â”œâ”€â”€ BattleStatus.ts
â”‚   â”œâ”€â”€ ActionType.ts
â”‚   â””â”€â”€ TypeChart.ts
â””â”€â”€ index.ts
```

## Fluxo de Trabalho Squad A

1. **Definir interfaces** primeiro
2. **Implementar entidades** com validaÃ§Ãµes
3. **Criar regras** de negÃ³cio puras
4. **Implementar cÃ¡lculos** matemÃ¡ticos
5. **Testar unitariamente** tudo
6. **Documentar** fÃ³rmulas e regras

## IntegraÃ§Ã£o com Outras Camadas

- **Application:** Usa entidades e regras do domain
- **Services:** NÃƒO acessa domain diretamente
- **State:** Armazena instÃ¢ncias de entidades do domain
- **UI:** NUNCA acessa domain diretamente


