/**
 * Ponto de entrada principal do projeto PDA-POKE
 * 
 * Este arquivo serve como barrel export central para todo o projeto
 */

// Export das interfaces do Domain
export * from './domain/interfaces';

// Export das interfaces da Application (quando criadas)
// export * from './application/interfaces';

// Export das interfaces da Infrastructure (quando criadas)
// export * from './infrastructure/interfaces';

// Export das interfaces da UI (quando criadas)
// export * from './ui/interfaces';

/**
 * Estrutura do projeto:
 * 
 * src/
 * ├── domain/           - Regras de negócio puras
 * │   └── interfaces/ - Contratos do domínio
 * ├── application/       - Orquestração e casos de uso
 * │   └── interfaces/ - Interfaces da aplicação
 * ├── infrastructure/     - Detalhes técnicos (WebSocket, DB, etc)
 * │   └── interfaces/ - Interfaces da infraestrutura
 * └── ui/               - Interface com o usuário
 *     └── interfaces/ - Interfaces da UI
 */
