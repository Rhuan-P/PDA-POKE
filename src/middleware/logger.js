/**
 * Middleware de Logging personalizado
 * Estrutura de logs consistente para debugging
 */

import morgan from 'morgan';

// Formato personalizado de log
const logFormat = ':method :url :status :res[content-length] - :response-time ms';

// Configuração para desenvolvimento
const developmentLogger = morgan(logFormat, {
  stream: process.stdout,
  skip: (req, res) => process.env.NODE_ENV === 'test'
});

// Configuração para produção
const productionLogger = morgan('combined', {
  stream: process.stdout,
  skip: (req, res) => process.env.NODE_ENV === 'test'
});

// Logger baseado em ambiente
const logger = process.env.NODE_ENV === 'production' 
  ? productionLogger 
  : developmentLogger;

// Middleware customizado para logs de erro
const errorLogger = (err, req, res, next) => {
  console.error('Error Logger:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: {
      message: err.message,
      stack: err.stack,
      status: err.status || 500
    }
  });
  next(err);
};

// Middleware para logs de requisições customizadas
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log('Request Log:', {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

export {
  logger,
  errorLogger,
  requestLogger
};

export default logger;
