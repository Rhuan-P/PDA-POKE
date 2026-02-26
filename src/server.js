/**
 * Servidor Principal - Webhook Battle System
 * DevOps Squad - Webhook Battle System
 * 
 * Servidor Express com WebSocket para sistema de batalhas
 * multiplayer em tempo real.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

// Importar battle API
const battleRouter = require('./api/battle');

// Importar WebSocket
const BattleSocket = require('./websocket/battleSocket');

class BattleServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = process.env.PORT || 3001;
    this.nodeEnv = process.env.NODE_ENV || 'development';
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupErrorHandling();
    this.setupGracefulShutdown();
  }

  /**
   * Configurar middleware
   */
  setupMiddleware() {
    // Security
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"],
        },
      },
    }));

    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    if (this.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Static files (para frontend em produção)
    this.app.use(express.static(path.join(__dirname, '../dist')));

    // Request timing
    this.app.use((req, res, next) => {
      req.startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        console.log(`📡 ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      });
      
      next();
    });
  }

  /**
   * Configurar rotas
   */
  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Battle Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        environment: this.nodeEnv
      });
    });

    // API routes
    this.app.use('/api/battle', battleRouter);

    // API info
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'PDA-POKE Battle API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          battle: '/api/battle',
          docs: '/api/docs'
        },
        websocket: {
          url: `ws://localhost:${this.port}`,
          events: [
            'join-battle',
            'start-battle',
            'skill-selected',
            'execute-turn',
            'battle-finished'
          ]
        }
      });
    });

    // API docs (placeholder)
    this.app.get('/api/docs', (req, res) => {
      res.json({
        success: true,
        message: 'API Documentation',
        docs: {
          'POST /api/battle/invite': 'Create battle invite',
          'POST /api/battle/join': 'Join battle via invite',
          'POST /api/battle/start': 'Start battle',
          'POST /api/battle/turn': 'Execute battle turn',
          'GET /api/battle/lobby/:id': 'Get lobby info',
          'GET /api/battle/stats': 'Get system stats'
        }
      });
    });

    // Frontend fallback (SPA)
    this.app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({
          success: false,
          error: 'API endpoint not found'
        });
      }
      
      // Servir frontend em produção
      if (this.nodeEnv === 'production') {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
      } else {
        res.status(404).json({
          success: false,
          error: 'Not found - Frontend not available in development mode'
        });
      }
    });
  }

  /**
   * Configurar WebSocket
   */
  setupWebSocket() {
    this.battleSocket = new BattleSocket(this.server);
    
    console.log('🔌 WebSocket server configurado');
  }

  /**
   * Configurar tratamento de erros
   */
  setupErrorHandling() {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
        method: req.method
      });
    });

    // Global error handler
    this.app.use((err, req, res, next) => {
      console.error('❌ Erro global:', err);
      
      // Não expor detalhes do erro em produção
      const errorDetails = this.nodeEnv === 'development' ? err.stack : undefined;
      
      res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
        ...(errorDetails && { details: errorDetails })
      });
    });

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      this.gracefulShutdown('SIGTERM');
    });
  }

  /**
   * Configurar shutdown gracioso
   */
  setupGracefulShutdown() {
    const shutdown = (signal) => {
      console.log(`\n🛑 Recebido ${signal}. Iniciando shutdown gracioso...`);
      
      // Parar de aceitar novas conexões
      this.server.close((err) => {
        if (err) {
          console.error('❌ Erro ao fechar servidor:', err);
          process.exit(1);
        }
        
        console.log('✅ Servidor fechado com sucesso');
        
        // Fechar conexões WebSocket
        if (this.battleSocket) {
          const stats = this.battleSocket.getStats();
          console.log(`📊 Estatísticas finais:`, stats);
        }
        
        process.exit(0);
      });
      
      // Forçar shutdown após 10 segundos
      setTimeout(() => {
        console.log('⏰ Forçando shutdown...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  /**
   * Iniciar servidor
   */
  start() {
    this.server.listen(this.port, () => {
      console.log('\n🚀 ================================');
      console.log('🎮 PDA-POKE Battle Server');
      console.log('🚀 ================================');
      console.log(`📡 Servidor rodando na porta ${this.port}`);
      console.log(`🌍 Ambiente: ${this.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${this.port}/api`);
      console.log(`🔌 WebSocket: ws://localhost:${this.port}`);
      console.log(`❤️  Health: http://localhost:${this.port}/health`);
      console.log('🚀 ================================\n');
      
      // Log de inicialização
      console.log('📊 Serviços inicializados:');
      console.log('  ✅ Express Server');
      console.log('  ✅ WebSocket Server');
      console.log('  ✅ Battle API');
      console.log('  ✅ Invite Service');
      console.log('  ✅ Battle Lobby');
      console.log('  ✅ Mock Data Service');
      console.log('  ✅ Turn Calculator');
      
      // Estatísticas iniciais
      this.logInitialStats();
    });

    this.server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${this.port} já está em uso`);
        process.exit(1);
      } else {
        console.error('❌ Erro no servidor:', err);
        process.exit(1);
      }
    });
  }

  /**
   * Log estatísticas iniciais
   */
  logInitialStats() {
    try {
      const InviteService = require('./services/InviteService');
      const BattleLobby = require('./services/BattleLobby');
      const MockDataService = require('./services/MockDataService');
      
      console.log('\n📈 Estatísticas iniciais:');
      console.log('  🎮 Convites:', InviteService.getStats());
      console.log('  ⚔️ Salas:', BattleLobby.getStats());
      console.log('  📊 Mock Data:', MockDataService.getStats());
      console.log('  💾 Memória:', process.memoryUsage());
      console.log('  ⏱️  Uptime:', process.uptime(), 'segundos');
      
    } catch (error) {
      console.log('⚠️ Não foi possível obter estatísticas iniciais:', error.message);
    }
  }

  /**
   * Obter estatísticas do servidor
   */
  getStats() {
    const stats = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        environment: this.nodeEnv,
        port: this.port
      },
      websocket: this.battleSocket ? this.battleSocket.getStats() : null,
      timestamp: new Date().toISOString()
    };

    try {
      const InviteService = require('./services/InviteService');
      const BattleLobby = require('./services/BattleLobby');
      const MockDataService = require('./services/MockDataService');
      
      stats.services = {
        invites: InviteService.getStats(),
        lobbies: BattleLobby.getStats(),
        mockData: MockDataService.getStats()
      };
    } catch (error) {
      stats.services = { error: error.message };
    }

    return stats;
  }
}

// Iniciar servidor se executado diretamente
if (require.main === module) {
  const server = new BattleServer();
  server.start();
}

module.exports = BattleServer;
