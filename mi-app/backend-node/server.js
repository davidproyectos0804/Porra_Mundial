// Backend principal - Node.js + Express
// Este archivo configura el servidor Express y las rutas de la API

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

// Crear aplicación Express
const app = express();
const PORT = 3000;

// Middleware: CORS - Permite que el frontend Angular (localhost:4200) acceda a la API
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Middleware: Parsear JSON en el body de las peticiones
app.use(express.json());

// Middleware: Rutas de la API
app.use('/api', routes);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
