/**
 * Middleware CORS personalizado
 * Configuração segura para desenvolvimento e produção
 */

import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir origins em desenvolvimento
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    // Em produção, usar variáveis de ambiente
    const prodOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    const allAllowedOrigins = [...allowedOrigins, ...prodOrigins];
    
    // Permitir se não houver origin (ex: Postman) ou se estiver na lista
    if (!origin || allAllowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

export const corsMiddleware = cors(corsOptions);
export default corsMiddleware;
