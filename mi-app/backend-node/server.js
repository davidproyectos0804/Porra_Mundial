// Backend principal - Node.js + Express
// Este archivo configura el servidor Express y las rutas de la API

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: CORS
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://porra-mundial-theta.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware: Parsear JSON
app.use(express.json());

// Middleware: Rutas de la API
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Conectar a MongoDB Atlas y arrancar servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error.message);
  });