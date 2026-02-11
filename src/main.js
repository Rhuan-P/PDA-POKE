/**
 * Bootstrap da Aplicação - Ponto de entrada principal
 * Time UX + DevOps: Implementar aqui inicialização
 * Vue como biblioteca: usar apenas createApp e montagem
 * 
 * O que implementar:
 * - Inicialização do Vue
 * - Configuração do Pinia
 * - Montagem da aplicação
 * - Importação de estilos
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';

// TODO: Time UX - Importar componentes principais
import App from './ui/App.vue';
import './assets/styles.css';

// TODO: Time UX - Configurar instância Vue
const app = createApp(App);

// TODO: Time UX - Configurar Pinia para estado reativo
const pinia = createPinia();
app.use(pinia);

// TODO: Time UX - Montar aplicação
app.mount('#app');

// Export para uso em testes se necessário
export { app, pinia };
