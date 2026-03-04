<template>
  <div id="app">
    <header class="app-header">
      <h1>⚔️ Pokemon Battle Simulator</h1>
      <p>Real-time multiplayer Pokemon battles</p>
      <nav class="app-nav">
        <router-link to="/selection" class="nav-link" active-class="active">
          🎮 Seleção
        </router-link>
        <router-link to="/battle" class="nav-link" active-class="active">
          ⚔️ Batalha
        </router-link>
      </nav>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>Built with Vue.js + Node.js + Express</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.app-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 20px;
}

.app-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.nav-link.active {
  background: rgba(255,255,255,0.3);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.app-main {
  flex: 1;
  padding: 0;
}

.app-footer {
  background: #343a40;
  color: white;
  text-align: center;
  padding: 15px;
  font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-header p {
    font-size: 1rem;
  }
  
  .app-nav {
    gap: 10px;
  }
  
  .nav-link {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
</style>
