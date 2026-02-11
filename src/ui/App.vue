<!--
  Componente App - Componente raiz da aplicação PDA-POKE
  Time UX: Implementar aqui o componente principal
  Vue como biblioteca: usar apenas reatividade e composição
  
  O que implementar:
  - Estrutura básica da aplicação
  - Importação de estilos globais
  - Configuração de tema
-->
<script setup>
import { ref, onMounted } from 'vue';
import BattleView from './views/BattleView.vue';

// Estado da navegação
const currentView = ref('dashboard');

const views = {
  dashboard: 'Dashboard',
  battle: 'Battle Simulator',
  docs: 'Documentation'
};

// Debug para verificar valores exatos
onMounted(() => {
  console.log('🚀 App.vue montado com sucesso!');
  console.log('📱 View atual:', currentView.value);
  console.log('🎯 Views disponíveis:', views);
});

// Métodos de navegação
const navigateTo = (view) => {
  console.log('🔄 Navegando para:', view);
  console.log('🔍 Comparando:', `"${view}" === "${views.battle}"`, view === views.battle);
  console.log('🔍 Comparando minúsculo:', `"${view}" === "battle simulator"`, view === 'battle simulator');
  
  if (view === 'docs') {
    window.open('https://github.com/Rhuan-P/PDA-POKE/blob/main/README.md', '_blank');
  } else {
    currentView.value = view;
  }
};

// Links reais para o projeto GitHub
const projectLinks = ref([
  { 
    title: '📚 Documentação Técnica', 
    description: 'Arquitetura e guias de implementação', 
    link: 'https://github.com/Rhuan-P/PDA-POKE/blob/main/README.md', 
    external: true 
  },
  { 
    title: '🎮 PDA-POKE Simulator', 
    description: 'Aplicação principal de batalhas', 
    link: 'battle', 
    external: false 
  },
  { 
    title: '🏗️ Arquitetura PDA-POKE', 
    description: 'Estrutura oficial do sistema', 
    link: 'https://github.com/Rhuan-P/PDA-POKE/blob/main/docs/architecture/pokemon-battle-architecture.md', 
    external: true 
  }
]);

const squadInfo = ref([
  {
    name: 'Duo Game Logic',
    description: 'Regras de negócio, entidades, cálculos',
    focus: 'Domain Layer',
    link: 'https://github.com/Rhuan-P/PDA-POKE/blob/main/backlog/backlog-squad-a.md'
  },
  {
    name: 'Duo User Experience',
    description: 'Interface, APIs, estado reativo',
    focus: 'Services/State/UI Layers',
    link: 'https://github.com/Rhuan-P/PDA-POKE/blob/main/backlog/backlog-squad-b.md'
  },
  {
    name: 'Duo DevOps',
    description: 'Estrutura, CI/CD, documentação',
    focus: 'Project Governance',
    link: 'https://github.com/Rhuan-P/PDA-POKE/blob/main/backlog/backlog-devops.md'
  }
]);
</script>

<template>
  <div id="app">
    <!-- Navegação -->
    <nav class="app-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>PDA-POKE</h1>
          <span class="nav-subtitle">Pokémon Battle Simulator</span>
        </div>
        
        <div class="nav-menu">
          <button 
            v-for="view in views" 
            :key="view"
            @click="navigateTo(view.toLowerCase())"
            :class="['nav-button', { active: currentView === view.toLowerCase() }]"
          >
            {{ view }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Dashboard View -->
    <div v-if="currentView === 'dashboard'" class="dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <h2>PDA-POKE Development Hub</h2>
        <p>Centro de desenvolvimento do Pokémon Battle Simulator</p>
      </div>

      <!-- Por Que Vue Como Biblioteca? -->
      <div class="section">
        <h3><i class="fas fa-question-circle"></i> Por Que Vue Como Biblioteca?</h3>
        <div class="important-note">
          <h4>📌 Decisão Arquitetural Importante</h4>
          <p>Usamos <strong>Vue 3 como biblioteca</strong>, não como framework completo. Isso significa:</p>
          <ul>
            <li><strong>✅ Apenas reatividade e renderização</strong> - Sem Vue Router, Vuex, ou eco-sistema completo</li>
            <li><strong>✅ Controle total</strong> - Implementamos apenas o que precisamos</li>
            <li><strong>✅ Performance otimizada</strong> - Sem sobrecarga de recursos não utilizados</li>
            <li><strong>✅ Aprendizado focado</strong> - Equipes aprendem conceitos, não apenas framework</li>
          </ul>
          <div class="tech-highlight">
            <strong>Estado:</strong> Pinia para reatividade global<br>
            <strong>Componentes:</strong> Vue 3 Composition API<br>
            <strong>Roteamento:</strong> Implementação própria (se necessário)
          </div>
        </div>
      </div>

      <!-- Architecture Overview - Otimizado -->
      <div class="section">
        <h3><i class="fas fa-sitemap"></i> Arquitetura PDA-POKE</h3>
        <div class="architecture-simple">
          <div class="arch-flow">
            <div class="arch-item">
              <i class="fas fa-database"></i>
              <strong>Domain</strong>
              <span>Regras de negócio</span>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-item">
              <i class="fas fa-cogs"></i>
              <strong>Application</strong>
              <span>Orquestração</span>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-item">
              <i class="fas fa-plug"></i>
              <strong>Services</strong>
              <span>APIs externas</span>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-item">
              <i class="fas fa-sync"></i>
              <strong>State</strong>
              <span>Estado reativo</span>
            </div>
            <div class="arch-arrow">→</div>
            <div class="arch-item">
              <i class="fas fa-desktop"></i>
              <strong>UI</strong>
              <span>Componentes Vue</span>
            </div>
          </div>
          
          <div class="arch-layers">
            <div class="layer-card">
              <h4><i class="fas fa-database"></i> Domain</h4>
              <p><strong>Regras de negócio puras</strong> sem dependências externas</p>
              <div class="layer-details">
                <span class="detail-item"><i class="fas fa-check"></i> Entidades (Pokémon, Stats, Habilidades)</span>
                <span class="detail-item"><i class="fas fa-check"></i> Cálculos de dano e batalha</span>
                <span class="detail-item"><i class="fas fa-check"></i> Validações e regras do jogo</span>
                <span class="detail-item"><i class="fas fa-check"></i> Funções puras e testáveis</span>
              </div>
              <div class="layer-tech">TypeScript puro</div>
            </div>
            
            <div class="layer-card">
              <h4><i class="fas fa-cogs"></i> Application</h4>
              <p><strong>Orquestração de fluxos</strong> entre as camadas</p>
              <div class="layer-details">
                <span class="detail-item"><i class="fas fa-check"></i> Controladores de aplicação</span>
                <span class="detail-item"><i class="fas fa-check"></i> Coordenação entre Domain e Services</span>
                <span class="detail-item"><i class="fas fa-check"></i> Implementação de casos de uso</span>
                <span class="detail-item"><i class="fas fa-check"></i> Interfaces entre camadas</span>
              </div>
              <div class="layer-tech">TypeScript</div>
            </div>
            
            <div class="layer-card">
              <h4><i class="fas fa-plug"></i> Services</h4>
              <p><strong>Comunicação com APIs externas</strong> e serviços auxiliares</p>
              <div class="layer-details">
                <span class="detail-item"><i class="fas fa-check"></i> Integração com PokeAPI</span>
                <span class="detail-item"><i class="fas fa-check"></i> Validação de dados externos</span>
                <span class="detail-item"><i class="fas fa-check"></i> Transformação de dados</span>
                <span class="detail-item"><i class="fas fa-check"></i> Tratamento de erros de API</span>
              </div>
              <div class="layer-tech">JavaScript</div>
            </div>
            
            <div class="layer-card">
              <h4><i class="fas fa-sync"></i> State</h4>
              <p><strong>Gerenciamento de estado reativo</strong> da aplicação</p>
              <div class="layer-details">
                <span class="detail-item"><i class="fas fa-check"></i> Estado global com Pinia</span>
                <span class="detail-item"><i class="fas fa-check"></i> Reatividade automática</span>
                <span class="detail-item"><i class="fas fa-check"></i> Persistência temporária</span>
                <span class="detail-item"><i class="fas fa-check"></i> Sincronização entre componentes</span>
              </div>
              <div class="layer-tech">JavaScript + Pinia</div>
            </div>
            
            <div class="layer-card">
              <h4><i class="fas fa-desktop"></i> UI</h4>
              <p><strong>Componentes visuais</strong> e interface do usuário</p>
              <div class="layer-details">
                <span class="detail-item"><i class="fas fa-check"></i> Componentes Vue 3 (como biblioteca)</span>
                <span class="detail-item"><i class="fas fa-check"></i> Renderização reativa</span>
                <span class="detail-item"><i class="fas fa-check"></i> Captura de eventos do usuário</span>
                <span class="detail-item"><i class="fas fa-check"></i> Feedback visual e interações</span>
              </div>
              <div class="layer-tech">Vue 3 + CSS</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Squad Details - Explicativo -->
      <div class="section">
        <h3>👥 Responsabilidades dos Duos</h3>
        <div class="squad-details-grid">
          <div class="squad-detail-card">
            <div class="squad-detail-header">
              <h4><i class="fas fa-gamepad"></i> Duo Game Logic</h4>
              <span class="squad-detail-focus">Domain Layer</span>
            </div>
            
            <div class="squad-detail-content">
              <h5>🎯 Foco Principal:</h5>
              <p>Implementar as <strong>regras puras do jogo</strong> sem dependências externas</p>
              
              <h5>📍 Áreas de Atuação:</h5>
              <p>Trabalhe principalmente com <strong>lógica de negócio</strong>, mas colabore quando necessário:</p>
              <ul>
                <li><code>src/domain/models/</code> - Entidades e interfaces</li>
                <li><code>src/domain/services/</code> - Serviços de domínio</li>
                <li><code>src/domain/utils/</code> - Funções utilitárias</li>
                <li><code>src/application/</code> - Quando precisar orquestrar fluxos</li>
              </ul>
              
              <h5>🛠️ O que Faz:</h5>
              <ul>
                <li>Criar entidades imutáveis (Pokémon, Stats, Habilidades)</li>
                <li>Implementar cálculos de dano e batalha</li>
                <li>Definir regras de negócio puras</li>
                <li>Escrever funções puras e testáveis</li>
                <li>Manter separação estrita de responsabilidades</li>
                <li>Documentar interfaces e contratos</li>
              </ul>
            </div>
            
            <a href="https://github.com/Rhuan-P/PDA-POKE/blob/main/backlog/backlog-squad-a.md" target="_blank" class="squad-detail-link">
              Ver Backlog Detalhado →
            </a>
          </div>
          
          <div class="squad-detail-card">
            <div class="squad-detail-header">
              <h4><i class="fas fa-paint-brush"></i> Duo User Experience</h4>
              <span class="squad-detail-focus">Services/State/UI Layers</span>
            </div>
            
            <div class="squad-detail-content">
              <h5>🎯 Foco Principal:</h5>
              <p>Criar <strong>interface do usuário</strong> e conectar com APIs externas</p>
              
              <h5>📍 Áreas de Atuação:</h5>
              <p>Foque em <strong>experiência do usuário</strong>, mas participe de todo o stack frontend:</p>
              <ul>
                <li><code>src/services/</code> - APIs e comunicação externa</li>
                <li><code>src/state/</code> - Estado reativo global (Pinia)</li>
                <li><code>src/ui/</code> - Componentes visuais Vue</li>
                <li><code>src/main.js</code> - Bootstrap da aplicação</li>
                <li><code>src/application/</code> - Quando precisar integrar com domínio</li>
              </ul>
              
              <h5>🛠️ O que Faz:</h5>
              <ul>
                <li>Implementar comunicação com PokeAPI</li>
                <li>Criar estado reativo com Pinia</li>
                <li>Desenvolver componentes Vue (como biblioteca)</li>
                <li>Orquestrar fluxos da aplicação</li>
                <li>Manter experiência do usuário fluida</li>
                <li>Implementar feedback visual e interações</li>
              </ul>
            </div>
            
            <a href="https://github.com/Rhuan-P/PDA-POKE/blob/main/backlog/backlog-squad-b.md" target="_blank" class="squad-detail-link">
              Ver Backlog Detalhado →
            </a>
          </div>
          
          <div class="squad-detail-card">
            <div class="squad-detail-header">
              <h4><i class="fas fa-tools"></i> Duo DevOps</h4>
              <span class="squad-detail-focus">Project Governance</span>
            </div>
            
            <div class="squad-detail-content">
              <h5>🎯 Foco Principal:</h5>
              <p>Garantir <strong>estrutura, qualidade e governança</strong> do projeto</p>
              
              <h5>📍 Áreas de Atuação:</h5>
              <p>Cuide da <strong>infraestrutura do projeto</strong>, mas suporte todas as equipes:</p>
              <ul>
                <li><code>package.json</code> - Dependências e scripts</li>
                <li><code>vite.config.js</code> - Configuração de build</li>
                <li><code>.github/workflows/</code> - CI/CD e automações</li>
                <li><code>docs/</code> - Documentação técnica</li>
                <li><code>src/</code> - Quando precisar ajustar estrutura</li>
              </ul>
              
              <h5>🛠️ O que Faz:</h5>
              <ul>
                <li>Manter estrutura oficial do projeto</li>
                <li>Configurar pipelines de CI/CD</li>
                <li>Documentar arquitetura e processos</li>
                <li>Garantir qualidade e padrões</li>
                <li>Monitorar performance e métricas</li>
                <li>Gerenciar configurações de ambiente</li>
              </ul>
            </div>
            
            <a href="https://github.com/Rhuan-P/PDA-POKE/blob/main/backlog/backlog-devops.md" target="_blank" class="squad-detail-link">
              Ver Backlog Detalhado →
            </a>
          </div>
        </div>
      </div>

      <!-- Links do Projeto -->
      <div class="section">
        <h3><i class="fas fa-link"></i> Links do Projeto</h3>
        <div class="links-grid">
          <a 
            v-for="link in projectLinks" 
            :key="link.title"
            :href="link.link"
            :target="link.external ? '_blank' : '_self'"
            class="link-card"
          >
            <h4>{{ link.title }}</h4>
            <p>{{ link.description }}</p>
            <span class="link-arrow">{{ link.external ? '↗️' : '→' }}</span>
          </a>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="section">
        <h3><i class="fas fa-play-circle"></i> Próximos Passos</h3>
        <div class="steps-card">
          <h4>🎯 Para Começar o Desenvolvimento:</h4>
          <ol>
            <li><strong>Revise a arquitetura</strong> em <code>/docs/architecture/</code></li>
            <li><strong>Acesse seu backlog</strong> específico do duo</li>
            <li><strong>Estude os templates</strong> em <code>/src/</code></li>
            <li><strong>Implemente seguindo</strong> as regras DTR/DTI/DTA</li>
            <li><strong>Mantenha a comunicação</strong> com as outras equipes</li>
          </ol>
          
          <div class="note">
            <strong>💡 Importante:</strong> Vue é usado como biblioteca, não como framework completo.
            Siga estritamente a arquitetura definida.
          </div>
        </div>
      </div>
    </div>

    <!-- Battle View -->
    <BattleView v-else-if="currentView === views.battle || currentView === 'battle simulator'" />
  </div>
</template>

<style>
/* Estilos globais - Profissionais e clean */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8fafc;
  color: #1a202c;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* Navegação - Profissional */
.app-nav {
  background: #2d3748;
  color: white;
  padding: 1rem 0;
  border-bottom: 3px solid #4a5568;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.nav-subtitle {
  font-size: 0.875rem;
  opacity: 0.8;
  font-weight: 400;
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-button.active {
  background: #4a5568;
  border-color: #4a5568;
}

/* Dashboard - Profissional */
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.dashboard-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-weight: 700;
}

.dashboard-header p {
  color: #718096;
  font-size: 1.125rem;
  font-weight: 400;
}

/* Sections */
.section {
  margin-bottom: 3rem;
}

.section h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
  font-weight: 600;
  border-left: 4px solid #4a5568;
  padding-left: 1rem;
}

/* Overview Grid */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.overview-card h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1.125rem;
}

.overview-card p {
  color: #4a5568;
  margin-bottom: 1rem;
}

.overview-card ul {
  list-style: none;
  padding: 0;
}

.overview-card li {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.overview-card li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #4a5568;
}

/* Squad Grid */
.squad-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.squad-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.squad-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.squad-header h4 {
  margin: 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1.125rem;
}

.squad-focus {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.squad-description {
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.squad-link {
  color: #3182ce;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.squad-link:hover {
  text-decoration: underline;
}

/* Important Note */
.important-note {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.important-note h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1.125rem;
}

.important-note p {
  margin: 0 0 1.5rem 0;
  color: #4a5568;
  font-size: 1rem;
}

.important-note ul {
  margin: 0 0 1.5rem 0;
  padding: 0;
}

.important-note li {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  color: #4a5568;
  font-size: 0.875rem;
}

.important-note li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  background: #48bb78;
  border-radius: 50%;
}

.tech-highlight {
  background: #f7fafc;
  border-left: 4px solid #4299e1;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #2b6cb0;
  line-height: 1.6;
}

.tech-highlight strong {
  color: #2c5282;
}

/* Squad Details Grid */
.squad-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.squad-detail-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.squad-detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e0;
}

.squad-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.squad-detail-header h4 {
  margin: 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1.25rem;
}

.squad-detail-focus {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.squad-detail-content {
  margin-bottom: 1.5rem;
}

.squad-detail-content h5 {
  margin: 1.5rem 0 0.75rem 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1rem;
}

.squad-detail-content h5:first-child {
  margin-top: 0;
}

.squad-detail-content p {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 0.875rem;
}

.squad-detail-content ul {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.squad-detail-content li {
  margin-bottom: 0.5rem;
  color: #718096;
  font-size: 0.875rem;
}

.squad-detail-content code {
  background: #f7fafc;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.8em;
  color: #2d3748;
}

.squad-detail-link {
  color: #3182ce;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border: 1px solid #3182ce;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.squad-detail-link:hover {
  background: #3182ce;
  color: white;
  text-decoration: none;
}

.layer-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f0fdf4;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #374151;
  font-weight: 500;
  border: 1px solid #d1d5db;
}

.detail-item i {
  color: #10b981;
  font-size: 0.625rem;
}

/* Architecture Layers */
.arch-layers {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.layer-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.layer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e0;
}

.layer-card h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.layer-card h4 i {
  color: #4299e1;
}

.layer-card p {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 0.875rem;
}

.layer-card ul {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.layer-card li {
  margin-bottom: 0.5rem;
  color: #718096;
  font-size: 0.875rem;
}

.layer-tech {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;
}

/* Architecture Simple */
.architecture-simple {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.arch-flow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.arch-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  min-width: 120px;
  flex: 1;
}

.arch-item i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.arch-item strong {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.arch-item span {
  font-size: 0.875rem;
  opacity: 0.9;
}

.arch-arrow {
  font-size: 1.5rem;
  color: #718096;
  font-weight: bold;
  margin: 0 0.5rem;
}

.arch-tech {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.tech-item {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 6px;
  border-left: 4px solid #4299e1;
  font-size: 0.875rem;
  text-align: center;
  transition: all 0.2s ease;
}

.tech-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tech-item i {
  font-size: 1.5rem;
  color: #4299e1;
  margin-bottom: 0.75rem;
  display: block;
}

.tech-item strong {
  color: #2b6cb0;
  font-size: 1rem;
  display: block;
  margin-bottom: 0.5rem;
}

.tech-item p {
  color: #4a5568;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Architecture Overview */
.architecture-overview {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.arch-layer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
}

.arch-layer h4 {
  margin: 0 0 0.5rem 0;
}

.arch-layer p {
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.arch-layer code {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
}

.arch-arrow {
  text-align: center;
  font-size: 1.5rem;
  color: #718096;
  margin: 0.5rem 0;
}

/* Backlog Grid */
.backlog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.backlog-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.backlog-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e0;
}

.backlog-card h4 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1.125rem;
}

.backlog-card p {
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.backlog-focus {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;
}

.backlog-link {
  color: #3182ce;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.backlog-link:hover {
  text-decoration: underline;
}

/* Links Grid */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.link-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  text-decoration: none;
  color: inherit;
  display: block;
  transition: all 0.2s ease;
  position: relative;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e0;
}

.link-card h4 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1rem;
}

.link-card p {
  color: #718096;
  margin: 0;
  font-size: 0.875rem;
}

.link-arrow {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 1.125rem;
}

/* Steps Card */
.steps-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.steps-card h4 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 1.125rem;
}

.steps-card ol {
  margin: 0 0 1.5rem 0;
  padding-left: 1.5rem;
  color: #4a5568;
}

.steps-card li {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.steps-card strong {
  color: #2d3748;
}

.note {
  background: #f7fafc;
  border-left: 4px solid #4299e1;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #2b6cb0;
}

.note strong {
  color: #2c5282;
}

/* Code styling */
code {
  background: #f7fafc;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875em;
  color: #2d3748;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .dashboard {
    padding: 1rem;
  }
  
  .overview-grid,
  .squad-grid,
  .links-grid,
  .backlog-grid,
  .squad-details-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header h2 {
    font-size: 2rem;
  }
  
  .squad-detail-card {
    padding: 1.5rem;
  }
  
  .important-note {
    padding: 1.5rem;
  }
  
  .arch-flow {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .arch-layers {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .layer-card {
    padding: 1rem;
  }
  
  .layer-card h4 {
    font-size: 1rem;
  }
  
  .layer-card p {
    font-size: 0.875rem;
  }
  
  .layer-details {
    gap: 0.25rem;
  }
  
  .detail-item {
    padding: 0.2rem 0.5rem;
    font-size: 0.625rem;
  }
  
  .detail-item i {
    font-size: 0.5rem;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
