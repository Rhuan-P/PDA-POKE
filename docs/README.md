# Documentação PDA-POKE

## Visão Geral

Bem-vindo à documentação técnica do PDA-POKE (Pokémon Battle Simulator)! Este é seu guia completo para entender e implementar o projeto.

## 👥 Duos e Responsabilidades

- **Duo DevOps:** Estrutura, CI/CD, documentação, governança
- **Duo User Experience:** Interface, APIs, estado reativo
- **Duo Game Logic:** Regras de negócio, cálculos, validações

## 📚 Estrutura da Documentação

### 🏗️ Arquitetura Principal
- **[Arquitetura Oficial](./architecture/pokemon-battle-architecture.md)** - Definição completa das camadas e responsabilidades

### 📋 Backlogs por Duo
- **[Backlog Duo Game Logic](../backlog/backlog-squad-a.md)** - Regras de negócio e entidades
- **[Backlog Duo User Experience](../backlog/backlog-squad-b.md)** - Interface e APIs
- **[Backlog Duo DevOps](../backlog/backlog-devops.md)** - Estrutura e governança

### 🛠️ Contratos e Interfaces
- **[Contratos do Domínio](./contracts/)** - Interfaces TypeScript para regras de negócio
- **[Metodologia DTF](./dtf/)** - Processos de desenvolvimento

### 📚 Guias e Padrões
- **[Guias de Desenvolvimento](./guides/)** - Onboarding e boas práticas
- **[Padrões de Código](./patterns/)** - Convenções e revisão
- **[APIs Internas](./api/)** - Referência técnica

### ⚙️ Configuração
- **[Setup do Ambiente](./setup/)** - Configuração inicial do projeto

## 🎯 Como Começar

1. **Entenda a arquitetura** em [Arquitetura Oficial](./architecture/pokemon-battle-architecture.md)
2. **Acesse seu backlog** específico do duo
3. **Configure o ambiente** seguindo [Setup](./setup/)
4. **Estude os contratos** em [Contracts](./contracts/)

## 🚀 Tecnologias

- **Frontend:** Vue 3 (como biblioteca)
- **Estado:** Pinia
- **Domínio:** TypeScript
- **APIs:** JavaScript
- **Build:** Vite

## 📞 Suporte

Para dúvidas técnicas, consulte:
- Seu backlog específico do duo
- Documentação de arquitetura
- Canais de comunicação da equipe
- **[Backlog Squad B - UX](../backlog/backlog-squad-b.md)** - Interface, APIs e estado
- **[Backlog DevOps](../backlog/backlog-devops.md)** - Estrutura e governança

## � Começando Rápido

### Para o Time Game Logic
1. **Leia a arquitetura** para entender as regras do Domain
2. **Siga o backlog** para implementar entidades e regras
3. **Use TypeScript puro** sem dependências externas
4. **Teste unitariamente** cada função antes de integrar

### Para o Time UX
1. **Estude a arquitetura** para entender separação UI/Services/State
2. **Implemente os serviços** de comunicação com APIs externas
3. **Crie componentes Vue** usando apenas reatividade
4. **Configure o estado** com Pinia para reatividade global

### Para o Líder e DevOps
1. **Monitore a estrutura** para garantir conformidade
2. **Use os backlogs** para acompanhar progresso
3. **Garanta a qualidade** através de pipelines automatizadas
4. **Mantenha a documentação** sempre atualizada

## 📖 Navegação Rápida

### Por Responsabilidade
- **Domain (Game Logic):** `src/domain/` → Regras puras
- **Services (UX):** `src/services/` → APIs externas  
- **State (UX):** `src/state/` → Estado reativo
- **Application:** `src/application/` → Orquestração
- **UI (UX):** `src/ui/` → Componentes visuais
- **DevOps:** Estrutura, CI/CD, configuração

### Por Tipo de Documento
- **Conceitual:** Arquitetura e design patterns
- **Prático:** Guia de implementação e exemplos
- **Referência:** Backlogs detalhados por squad

## � Links Diretos

### 📋 Principal
- **[Voltar para README principal](../README.md)** - Visão geral do projeto
- **[Arquitetura completa](./architecture/pokemon-battle-architecture.md)** - Definição detalhada
- **[Guia prático](./architecture/implementation-guide.md)** - Implementação passo a passo

### 📋 Backlogs
- **[Squad A - Game Logic](../backlog/backlog-squad-a.md)** - Entidades e regras de negócio
- **[Squad B - UX](../backlog/backlog-squad-b.md)** - Interface, APIs e estado
- **[DevOps](../backlog/backlog-devops.md)** - Estrutura e governança

## 🎯 Foco em Qualidade

Esta documentação é projetada para:
- **Educar:** Conceitos de arquitetura limpa
- **Guiar:** Passos claros para implementação
- **Organizar:** Informação fácil de encontrar
- **Atualizar:** Sempre refletindo o estado atual do projeto

---

**Lembre-se:** Boa arquitetura não é sobre complexidade, é sobre clareza, separação e comunicação eficaz entre as equipes. **Arquivo:** `src/ui/components/PokemonCard.vue`
   - **Pasta:** `ui/components/`
   - **Camada:** UI
   - **Responsabilidade:** Interface visual

## 📊 Métricas de Qualidade

### Arquitetura
- **Separação de Responsabilidades:** 100% clara
- **Dependências:** Unidirecionais e bem definidas
- **Testabilidade:** Todas as camadas testáveis isoladamente

### Documentação
- **Cobertura:** 100% para arquitetura crítica
- **Exemplos:** Práticos e funcionais
- **Acessibilidade:** Fácil de encontrar e navegar

### Implementação
- **Adesão:** > 95% aos padrões definidos
- **Consistência:** Mesmos padrões em todo código
- **Qualidade:** Code reviews seguindo guias

## 🚨 Regras Críticas

### ✅ Sempre Faça
- Mantenha lógica de negócio no Domain
- Use TypeScript para regras críticas
- Separe claramente as responsabilidades
- Teste unidades do Domain isoladamente

### ❌ Nunca Faça
- Misture lógica de batalha em componentes Vue
- Use TypeScript em toda a UI (apenas onde crucial)
- Crie funções gigantes
- Esconda lógica em templates Vue

## 🔗 Links Rápidos

- **[Arquitetura Completa](./architecture/pokemon-battle-architecture.md)**
- **[Guia de Implementação](./architecture/implementation-guide.md)**
- **[Backlog Squad A](../backlog/backlog-squad-a.md)**
- **[Backlog Squad B](../backlog/backlog-squad-b.md)**
- **[Backlog DevOps](../backlog/backlog-devops.md)**

## 📝 Como Contribuir

1. **Mantenha a documentação atualizada** com as mudanças
2. **Siga os padrões definidos** nos guias
3. **Adicione exemplos práticos** quando introduzir novos conceitos
4. **Revise a clareza** para iniciantes regularmente

## 🆘 Suporte

- **Dúvidas sobre arquitetura:** Consulte a [Arquitetura Principal](./architecture/pokemon-battle-architecture.md)
- **Problemas de implementação:** Verifique o [Guia de Implementação](./architecture/implementation-guide.md)
- **Padrões e convenções:** Revise os [Backlogs](../backlog/) das squads
- **Issues e sugestões:** Abra uma issue no repositório

---

**Lembre-se:** Boa arquitetura não é sobre complexidade, é sobre clareza e separação de responsabilidades. Quando em dúvida, volte aos princípios fundamentais documentados aqui.
