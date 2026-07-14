const mongoose = require('mongoose');
require('dotenv').config();

const Partido = require('../models/Partido');
const Fase = require('../models/Fase');
const Equipo = require('../models/Equipo');

const seedCuartos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Buscar la fase de Octavos
    const fase = await Fase.findOne({ nombre: 'Cuartos' });
    if (!fase) {
      console.error('❌ Fase Cuartos no encontrada');
      process.exit(1);
    }
    console.log('✅ Fase Cuartos encontrada');

    // Función helper para buscar equipo
    const getEquipo = async (nombre) => {
      const equipo = await Equipo.findOne({ nombre });
      if (!equipo) {
        console.error(`❌ Equipo "${nombre}" no encontrado`);
        process.exit(1);
      }
      return equipo._id;
    };

    // =============================================
    // CAMBIA AQUÍ LOS NOMBRES DE LOS EQUIPOS
    // Y LAS FECHAS Y HORAS DE CADA PARTIDO
    // =============================================
    const partidos = [
  { local: 'Argentina', visitante: 'Suiza', fecha: '2026-07-12T03:00:00' },  
];

    // Insertar partidos
    const partidosAInsertar = [];
    for (const p of partidos) {
      const equipoLocal = await getEquipo(p.local);
      const equipoVisitante = await getEquipo(p.visitante);
      partidosAInsertar.push({
        fase: fase._id,
        equipoLocal,
        equipoVisitante,
        fechaHora: new Date(p.fecha)
      });
    }

    await Partido.insertMany(partidosAInsertar);
    console.log('✅ 16 partidos de Cuartos insertados');
    console.log('🎉 Completado');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedCuartos();