/**
 * Bootstrap da Aplicação - Ponto de entrada principal
 * Vue como biblioteca: usar apenas createApp e montagem
 * 
 * O que implementar:
 * - Inicialização do Vue
 * - Configuração do Pinia
 * - Configuração do Router
 * - Montagem da aplicação
 * - Importação de estilos
 */

import { createPinia } from 'pinia';
import { createApp } from 'vue';

// Importar componentes principais
import App from './App.vue';
import './assets/styles.css';
import router from './router';

// Configurar instância Vue
const app = createApp(App);

// Configurar Pinia para estado reativo
const pinia = createPinia();
app.use(pinia);

// Configurar Router para navegação
app.use(router);

// Montar aplicação
app.mount('#app');

// Export para uso em testes se necessário
export { app, pinia };

