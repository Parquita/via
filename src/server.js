const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const logger = require('./logger');
const usuariosRoutes = require('./routes/rutas.js');

app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.path}`);
  next();
});

app.use('/api', usuariosRoutes);



// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://rjfsuxiaoovjyljaarhg.supabase.co"]
    }
  }
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-dominio.com'] 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'API VIA funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Endpoint de prueba funcionando',
    status: 'success'
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Middleware para detectar si el servidor está caído y redirigir a página de error
app.use(async (req, res, next) => {
  // Verificar si la solicitud es para archivos estáticos o API (excepto health check)
  if ((req.path.startsWith('/api/') || req.path === '/api') && req.path !== '/api/health') {
    try {
      // Verificar conexión a la base de datos usando el endpoint de health
      const healthResponse = await fetch(`http://localhost:${PORT}/api/health`, {
        timeout: 5000 // Timeout de 5 segundos
      });

      if (!healthResponse.ok) {
        throw new Error('Health check failed');
      }

      const healthData = await healthResponse.json();
      if (healthData.status !== 'healthy') {
        throw new Error('Server unhealthy');
      }
    } catch (err) {
      console.error('Server health check failed:', err.message);

      // Redirigir a página de error para solicitudes desde el navegador
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.redirect('/error.html');
      } else {
        // Para solicitudes AJAX/API, devolver error JSON
        return res.status(503).json({
          error: 'Servicio no disponible',
          message: 'El servidor está temporalmente fuera de servicio. Por favor, intenta nuevamente más tarde.',
          code: 'SERVER_UNAVAILABLE'
        });
      }
    }
  }
  next();
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor VIA ejecutándose en puerto ${PORT}`);
  console.log(`📱 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

module.exports = app;


