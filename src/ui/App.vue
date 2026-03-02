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
      <section>
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
      </section>
      <!-- Architecture Overview - Otimizado -->
      <section>
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
            <!-- ...restante sem mudanças... -->
            <!-- Mantenha igual ao seu template, só ajuste as quebras das <section> -->
            <!-- Pode copiar e colar sua parte de arquitetura aqui -->
          </div>
        </div>
      </section>
      <!-- Squad Details - Explicativo -->
      <section>
        <!-- cards dos squads, igual ao seu template -->
        <!-- ... -->
      </section>
      <!-- Links do Projeto -->
      <section>
        <!-- cards dos links, igual ao seu template -->
        <!-- ... -->
      </section>
      <!-- Next Steps -->
      <section>
        <!-- passos e notas, igual ao seu template -->
        <!-- ... -->
      </section>
    </div>
    <!-- Battle View -->
    <BattleView v-else-if="currentView === views.battle || currentView === 'battle simulator'" />
  </div>
</template>