const mongoose = require('mongoose');
require('dotenv').config();

const Partido = require('../models/Partido');
const Fase = require('../models/Fase');
const Equipo = require('../models/Equipo');

const seedDieciseisavos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Buscar la fase de Dieciseisavos
    const fase = await Fase.findOne({ nombre: 'Dieciseisavos' });
    if (!fase) {
      console.error('❌ Fase Dieciseisavos no encontrada');
      process.exit(1);
    }
    console.log('✅ Fase Dieciseisavos encontrada');

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
  { local: 'Brasil', visitante: 'Japón', fecha: '2026-06-29T19:00:00' },
  { local: 'Alemania', visitante: 'Paraguay', fecha: '2026-06-29T22:30:00' },
  { local: 'Países Bajos', visitante: 'Marruecos', fecha: '2026-06-30T03:00:00' },
  { local: 'Costa de Marfil', visitante: 'Noruega', fecha: '2026-06-30T19:00:00' },
  { local: 'Francia', visitante: 'Suecia', fecha: '2026-06-30T23:00:00' },
  { local: 'México', visitante: 'Ecuador', fecha: '2026-07-01T03:00:00' },
  { local: 'Inglaterra', visitante: 'Rep. Democrática del Congo', fecha: '2026-07-01T18:00:00' },
  { local: 'Bélgica', visitante: 'Senegal', fecha: '2026-07-01T22:00:00' },
  { local: 'Estados Unidos', visitante: 'Bosnia y Herzegovina', fecha: '2026-07-02T02:00:00' },
  { local: 'España', visitante: 'Austria', fecha: '2026-07-02T21:00:00' },
  { local: 'Portugal', visitante: 'Croacia', fecha: '2026-07-03T01:00:00' },
  { local: 'Suiza', visitante: 'Argelia', fecha: '2026-07-03T05:00:00' },
  { local: 'Australia', visitante: 'Egipto', fecha: '2026-07-03T20:00:00' },
  { local: 'Argentina', visitante: 'Cabo Verde', fecha: '2026-07-04T00:00:00' },
  { local: 'Colombia', visitante: 'Ghana', fecha: '2026-07-04T03:30:00' },  
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
    console.log('✅ 16 partidos de Dieciseisavos insertados');
    console.log('🎉 Completado');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDieciseisavos();