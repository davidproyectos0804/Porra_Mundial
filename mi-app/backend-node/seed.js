const mongoose = require('mongoose');
require('dotenv').config();

const Grupo = require('./models/Grupo');
const Equipo = require('./models/Equipo');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Limpiar datos anteriores
    await Grupo.deleteMany({});
    await Equipo.deleteMany({});
    console.log('🗑️ Datos anteriores eliminados');

    // Crear los 12 grupos
    const grupos = await Grupo.insertMany([
      { nombre: 'A' }, { nombre: 'B' }, { nombre: 'C' },
      { nombre: 'D' }, { nombre: 'E' }, { nombre: 'F' },
      { nombre: 'G' }, { nombre: 'H' }, { nombre: 'I' },
      { nombre: 'J' }, { nombre: 'K' }, { nombre: 'L' }
    ]);
    console.log('✅ 12 grupos creados');

    // Mapa para encontrar grupo por letra fácilmente
    const grupoMap = {};
    grupos.forEach(g => grupoMap[g.nombre] = g._id);

    // Crear los 48 equipos
    await Equipo.insertMany([
      // Grupo A
      { nombre: 'México',            grupo: grupoMap['A'], bandera: 'mx' },
      { nombre: 'Sudáfrica',         grupo: grupoMap['A'], bandera: 'za' },
      { nombre: 'Corea del Sur',     grupo: grupoMap['A'], bandera: 'kr' },
      { nombre: 'República Checa',   grupo: grupoMap['A'], bandera: 'cz' },
      // Grupo B
      { nombre: 'Canadá',               grupo: grupoMap['B'], bandera: 'ca' },
      { nombre: 'Bosnia y Herzegovina', grupo: grupoMap['B'], bandera: 'ba' },
      { nombre: 'Catar',                grupo: grupoMap['B'], bandera: 'qa' },
      { nombre: 'Suiza',                grupo: grupoMap['B'], bandera: 'ch' },
      // Grupo C
      { nombre: 'Brasil',    grupo: grupoMap['C'], bandera: 'br' },
      { nombre: 'Marruecos', grupo: grupoMap['C'], bandera: 'ma' },
      { nombre: 'Haití',     grupo: grupoMap['C'], bandera: 'ht' },
      { nombre: 'Escocia',   grupo: grupoMap['C'], bandera: 'gb-sct' },
      // Grupo D
      { nombre: 'Estados Unidos', grupo: grupoMap['D'], bandera: 'us' },
      { nombre: 'Paraguay',       grupo: grupoMap['D'], bandera: 'py' },
      { nombre: 'Australia',      grupo: grupoMap['D'], bandera: 'au' },
      { nombre: 'Turquía',        grupo: grupoMap['D'], bandera: 'tr' },
      // Grupo E
      { nombre: 'Alemania',        grupo: grupoMap['E'], bandera: 'de' },
      { nombre: 'Curazao',         grupo: grupoMap['E'], bandera: 'cw' },
      { nombre: 'Costa de Marfil', grupo: grupoMap['E'], bandera: 'ci' },
      { nombre: 'Ecuador',         grupo: grupoMap['E'], bandera: 'ec' },
      // Grupo F
      { nombre: 'Países Bajos', grupo: grupoMap['F'], bandera: 'nl' },
      { nombre: 'Japón',        grupo: grupoMap['F'], bandera: 'jp' },
      { nombre: 'Suecia',       grupo: grupoMap['F'], bandera: 'se' },
      { nombre: 'Túnez',        grupo: grupoMap['F'], bandera: 'tn' },
      // Grupo G
      { nombre: 'Bélgica',       grupo: grupoMap['G'], bandera: 'be' },
      { nombre: 'Egipto',        grupo: grupoMap['G'], bandera: 'eg' },
      { nombre: 'Irán',          grupo: grupoMap['G'], bandera: 'ir' },
      { nombre: 'Nueva Zelanda', grupo: grupoMap['G'], bandera: 'nz' },
      // Grupo H
      { nombre: 'España',         grupo: grupoMap['H'], bandera: 'es' },
      { nombre: 'Cabo Verde',     grupo: grupoMap['H'], bandera: 'cv' },
      { nombre: 'Arabia Saudita', grupo: grupoMap['H'], bandera: 'sa' },
      { nombre: 'Uruguay',        grupo: grupoMap['H'], bandera: 'uy' },
      // Grupo I
      { nombre: 'Francia', grupo: grupoMap['I'], bandera: 'fr' },
      { nombre: 'Senegal', grupo: grupoMap['I'], bandera: 'sn' },
      { nombre: 'Irak',    grupo: grupoMap['I'], bandera: 'iq' },
      { nombre: 'Noruega', grupo: grupoMap['I'], bandera: 'no' },
      // Grupo J
      { nombre: 'Argentina', grupo: grupoMap['J'], bandera: 'ar' },
      { nombre: 'Argelia',   grupo: grupoMap['J'], bandera: 'dz' },
      { nombre: 'Austria',   grupo: grupoMap['J'], bandera: 'at' },
      { nombre: 'Jordania',  grupo: grupoMap['J'], bandera: 'jo' },
      // Grupo K
      { nombre: 'Portugal',                   grupo: grupoMap['K'], bandera: 'pt' },
      { nombre: 'Rep. Democrática del Congo', grupo: grupoMap['K'], bandera: 'cd' },
      { nombre: 'Uzbekistán',                 grupo: grupoMap['K'], bandera: 'uz' },
      { nombre: 'Colombia',                   grupo: grupoMap['K'], bandera: 'co' },
      // Grupo L
      { nombre: 'Inglaterra', grupo: grupoMap['L'], bandera: 'gb-eng' },
      { nombre: 'Croacia',    grupo: grupoMap['L'], bandera: 'hr' },
      { nombre: 'Ghana',      grupo: grupoMap['L'], bandera: 'gh' },
      { nombre: 'Panamá',     grupo: grupoMap['L'], bandera: 'pa' },
    ]);
    console.log('✅ 48 equipos creados');

    console.log('🎉 Seed completado con éxito');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    process.exit(1);
  }
};

seedData();