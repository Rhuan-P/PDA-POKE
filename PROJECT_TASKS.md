# 📋 Tasks por Squad - PDA-POKE

## 🔍 **Análise Completa da Estrutura**

### **✅ Status Geral:**
- **Estrutura:** Criada e seguindo arquitetura definida
- **Funcionalidades:** MVP implementado e funcionando
- **Reset:** Corrigido com debug e watch reativo
- **Navegação:** Funcional entre páginas

---

## 🎯 **Squad A - Game Logic (Domain Layer)**

### **📁 Arquivos Analisados:**
- `src/domain/entities/Pokemon.ts` ✅
- `src/domain/utils/StatCalculator.ts` ✅  
- `src/domain/services/battleService.ts` ✅

### **⚠️ Tasks Pendentes:**

#### **Alta Prioridade:**
1. **Implementar PokemonModel.create()**
   - **Arquivo:** `src/domain/entities/Pokemon.ts`
   - **Descrição:** Criar Pokémon com stats válidos
   - **Fórmula:** Implementar cálculo base de stats

2. **Implementar PokemonModel.takeDamage()**
   - **Arquivo:** `src/domain/entities/Pokemon.ts`
   - **Descrição:** Aplicar dano e retornar novo Pokémon imutável
   - **Regra:** Manter imutabilidade do objeto

3. **Implementar PokemonModel.isDefeated()**
   - **Arquivo:** `src/domain/entities/Pokemon.ts`
   - **Descrição:** Verificar se HP <= 0
   - **Retorno:** Boolean simples

#### **Média Prioridade:**
4. **Implementar StatCalculator.calculateByLevel()**
   - **Arquivo:** `src/domain/utils/StatCalculator.ts`
   - **Fórmula:** `stat = (baseStat * level / 50) + 5`
   - **Validação:** Level > 0, baseStat >= 0

5. **Implementar StatCalculator.calculateAllStats()**
   - **Arquivo:** `src/domain/utils/StatCalculator.ts`
   - **Descrição:** Calcular todos os stats baseados no nível
   - **Retorno:** PokemonStats completo

6. **Implementar StatCalculator.getTypeAdvantage()**
   - **Arquivo:** `src/domain/utils/StatCalculator.ts`
   - **Descrição:** Matriz de eficácia de tipos
   - **Exemplo:** Fire > Grass, Water > Fire

#### **Baixa Prioridade:**
7. **Implementar StatCalculator.applyModifiers()**
   - **Arquivo:** `src/domain/utils/StatCalculator.ts`
   - **Descrição:** Aplicar buffs/debuffs nos stats
   - **Uso:** Futuras implementações de habilidades

8. **Implementar StatCalculator.calculateDamage()**
   - **Arquivo:** `src/domain/utils/StatCalculator.ts`
   - **Descrição:** Cálculo completo considerando todos os fatores
   - **Fatores:** Stats, nível, tipo, eficácia

#### **Battle Service:**
9. **Implementar BattleService.calculateDamage()**
   - **Arquivo:** `src/domain/services/battleService.ts`
   - **Fórmula:** `(ataque / defesa) * baseDamage * eficácia_tipo`
   - **Integração:** Usar StatCalculator

10. **Implementar BattleService.getTurnOrder()**
    - **Arquivo:** `src/domain/services/battleService.ts`
    - **Descrição:** Baseado na velocidade dos Pokémons
    - **Retorno:** [Pokemon, Pokemon] ordenado

11. **Implementar BattleService.simulateBattle()**
    - **Arquivo:** `src/domain/services/battleService.ts`
    - **Descrição:** Executar batalha até um Pokémon ser derrotado
    - **Integração:** Usar todos os métodos anteriores

12. **Implementar BattleService.getWinner()**
    - **Arquivo:** `src/domain/services/battleService.ts`
    - **Descrição:** Verificar vitória/derrota
    - **Retorno:** Pokemon | null

---

## 🎨 **Squad B - User Experience (Services/UI/State)**

### **📁 Arquivos Analisados:**
- `src/services/pokeApiService.js` ✅
- `src/services/api-client.js` ✅
- `src/services/utils/cache.js` ✅
- `src/state/stores/gameStore.js` ✅
- `src/ui/views/BattleView.vue` ✅
- `src/ui/components/PlayerArea.vue` ✅

### **⚠️ Tasks Pendentes:**

#### **Alta Prioridade:**
1. **Implementar busca real por termo**
   - **Arquivo:** `src/services/pokeApiService.js`
   - **Método:** `searchPokemon()`
   - **Descrição:** Implementar busca real na API
   - **Status:** MVP simples implementado

2. **Integrar API de skills**
   - **Arquivo:** `src/services/pokeApiService.js`
   - **Método:** `getSkill()`
   - **Descrição:** Conectar com API de habilidades
   - **Status:** Stub implementado

#### **Média Prioridade:**
3. **Melhorar tratamento de erros**
   - **Arquivo:** `src/services/error-handler.js`
   - **Descrição:** Implementar tratamento específico
   - **Status:** Básico implementado

4. **Implementar Application Layer**
   - **Arquivo:** `src/application/controllers/battleController.ts`
   - **Descrição:** Conectar UI com Domain/Services
   - **Status:** Interface definida, métodos pendentes

#### **Baixa Prioridade:**
5. **Melhorar cache**
   - **Arquivo:** `src/services/utils/cache.js`
   - **Descrição:** Implementar persistência ou TTL mais avançado
   - **Status:** Simples implementado

6. **Otimizar UI**
   - **Arquivo:** `src/ui/components/`
   - **Descrição:** Remover logs excessivos, melhorar UX
   - **Status:** Funcional, com debug

---

## ⚙️ **Squad DevOps - Estrutura e Governança**

### **📁 Arquivos Analisados:**
- `package.json` ✅
- `vite.config.js` ✅
- Estrutura de pastas ✅
- `.gitignore` ✅

### **⚠️ Tasks Pendentes:**

#### **Alta Prioridade:**
1. **Configurar CI/CD**
   - **Local:** `.github/workflows/`
   - **Descrição:** Pipeline completo com testes
   - **Status:** Não implementado

2. **Configurar testes automatizados**
   - **Arquivo:** `jest.config.js`
   - **Descrição:** Testes unitários e integração
   - **Status:** Configurado, mas sem testes

#### **Média Prioridade:**
3. **Melhorar documentação**
   - **Arquivo:** `docs/`
   - **Descrição:** Guias práticos e exemplos
   - **Status:** Básica implementada

4. **Configurar ambiente de dev**
   - **Arquivo:** `.vscode/`
   - **Descrição:** Extensões e settings compartilhados
   - **Status:** Não implementado

---

## 🚀 **Próximos Passos Recomendados**

### **Para Squad A (Game Logic):**
1. **Priorizar métodos core:** PokemonModel.create(), takeDamage(), isDefeated()
2. **Implementar cálculos básicos:** StatCalculator.calculateByLevel(), calculateAllStats()
3. **Criar testes unitários:** Para todos os métodos implementados
4. **Documentar fórmulas:** Comentários explicativos nos cálculos

### **Para Squad B (UX):**
1. **Conectar Application Layer:** Integrar controllers com UI
2. **Implementar busca real:** Melhorar searchPokemon()
3. **Remover debug logs:** Limpar console.log do código
4. **Melhorar UX:** Animações, feedback visual

### **Para Squad DevOps:**
1. **Configurar GitHub Actions:** Pipeline de CI/CD completo
2. **Implementar testes automatizados:** Cobertura de código
3. **Documentar processos:** Guias de contribuição
4. **Configurar ambiente:** VS Code compartilhado

---

## 📊 **Resumo de Implementação**

### **✅ Concluído:**
- **Estrutura base:** 100%
- **Funcionalidades MVP:** 90%
- **Navegação:** 100%
- **Reset de batalha:** 100%

### **⚠️ Em Progresso:**
- **Domain Layer:** 20% (interfaces criadas, métodos pendentes)
- **Services Layer:** 70% (APIs funcionais, melhorias pendentes)
- **Application Layer:** 10% (interfaces definidas, métodos pendentes)
- **UI Layer:** 85% (funcional, com debug para remover)

### **🎯 Foco Imediato:**
1. **Squad A:** Implementar métodos core do PokemonModel
2. **Squad B:** Conectar Application Layer com UI
3. **Squad DevOps:** Configurar pipeline básico de CI

---

**📅 Data:** 10/02/2026  
**🔄 Status:** Análise completa, prioridades definidas
