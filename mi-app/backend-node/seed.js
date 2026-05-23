const mongoose = require('mongoose');
require('dotenv').config();

const Grupo = require('./models/Grupo');
const Equipo = require('./models/Equipo');
const Fase = require('./models/Fase');
const Partido = require('./models/Partido');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Limpiar datos anteriores
    await Partido.deleteMany({});
    await Fase.deleteMany({});
    await Equipo.deleteMany({});
    await Grupo.deleteMany({});
    console.log('🗑️ Datos anteriores eliminados');

    // Crear los 12 grupos
    const grupos = await Grupo.insertMany([
      { nombre: 'A' }, { nombre: 'B' }, { nombre: 'C' },
      { nombre: 'D' }, { nombre: 'E' }, { nombre: 'F' },
      { nombre: 'G' }, { nombre: 'H' }, { nombre: 'I' },
      { nombre: 'J' }, { nombre: 'K' }, { nombre: 'L' }
    ]);
    console.log('✅ 12 grupos creados');

    const grupoMap = {};
    grupos.forEach(g => grupoMap[g.nombre] = g._id);

    // Crear los 48 equipos
    const equipos = await Equipo.insertMany([
      { nombre: 'México',                   grupo: grupoMap['A'], bandera: 'mx' },
      { nombre: 'Sudáfrica',                grupo: grupoMap['A'], bandera: 'za' },
      { nombre: 'Corea del Sur',            grupo: grupoMap['A'], bandera: 'kr' },
      { nombre: 'República Checa',          grupo: grupoMap['A'], bandera: 'cz' },
      { nombre: 'Canadá',                   grupo: grupoMap['B'], bandera: 'ca' },
      { nombre: 'Bosnia y Herzegovina',     grupo: grupoMap['B'], bandera: 'ba' },
      { nombre: 'Catar',                    grupo: grupoMap['B'], bandera: 'qa' },
      { nombre: 'Suiza',                    grupo: grupoMap['B'], bandera: 'ch' },
      { nombre: 'Brasil',                   grupo: grupoMap['C'], bandera: 'br' },
      { nombre: 'Marruecos',                grupo: grupoMap['C'], bandera: 'ma' },
      { nombre: 'Haití',                    grupo: grupoMap['C'], bandera: 'ht' },
      { nombre: 'Escocia',                  grupo: grupoMap['C'], bandera: 'gb-sct' },
      { nombre: 'Estados Unidos',           grupo: grupoMap['D'], bandera: 'us' },
      { nombre: 'Paraguay',                 grupo: grupoMap['D'], bandera: 'py' },
      { nombre: 'Australia',                grupo: grupoMap['D'], bandera: 'au' },
      { nombre: 'Turquía',                  grupo: grupoMap['D'], bandera: 'tr' },
      { nombre: 'Alemania',                 grupo: grupoMap['E'], bandera: 'de' },
      { nombre: 'Curazao',                  grupo: grupoMap['E'], bandera: 'cw' },
      { nombre: 'Costa de Marfil',          grupo: grupoMap['E'], bandera: 'ci' },
      { nombre: 'Ecuador',                  grupo: grupoMap['E'], bandera: 'ec' },
      { nombre: 'Países Bajos',             grupo: grupoMap['F'], bandera: 'nl' },
      { nombre: 'Japón',                    grupo: grupoMap['F'], bandera: 'jp' },
      { nombre: 'Suecia',                   grupo: grupoMap['F'], bandera: 'se' },
      { nombre: 'Túnez',                    grupo: grupoMap['F'], bandera: 'tn' },
      { nombre: 'Bélgica',                  grupo: grupoMap['G'], bandera: 'be' },
      { nombre: 'Egipto',                   grupo: grupoMap['G'], bandera: 'eg' },
      { nombre: 'Irán',                     grupo: grupoMap['G'], bandera: 'ir' },
      { nombre: 'Nueva Zelanda',            grupo: grupoMap['G'], bandera: 'nz' },
      { nombre: 'España',                   grupo: grupoMap['H'], bandera: 'es' },
      { nombre: 'Cabo Verde',               grupo: grupoMap['H'], bandera: 'cv' },
      { nombre: 'Arabia Saudita',           grupo: grupoMap['H'], bandera: 'sa' },
      { nombre: 'Uruguay',                  grupo: grupoMap['H'], bandera: 'uy' },
      { nombre: 'Francia',                  grupo: grupoMap['I'], bandera: 'fr' },
      { nombre: 'Senegal',                  grupo: grupoMap['I'], bandera: 'sn' },
      { nombre: 'Irak',                     grupo: grupoMap['I'], bandera: 'iq' },
      { nombre: 'Noruega',                  grupo: grupoMap['I'], bandera: 'no' },
      { nombre: 'Argentina',                grupo: grupoMap['J'], bandera: 'ar' },
      { nombre: 'Argelia',                  grupo: grupoMap['J'], bandera: 'dz' },
      { nombre: 'Austria',                  grupo: grupoMap['J'], bandera: 'at' },
      { nombre: 'Jordania',                 grupo: grupoMap['J'], bandera: 'jo' },
      { nombre: 'Portugal',                 grupo: grupoMap['K'], bandera: 'pt' },
      { nombre: 'Rep. Democrática del Congo', grupo: grupoMap['K'], bandera: 'cd' },
      { nombre: 'Uzbekistán',               grupo: grupoMap['K'], bandera: 'uz' },
      { nombre: 'Colombia',                 grupo: grupoMap['K'], bandera: 'co' },
      { nombre: 'Inglaterra',               grupo: grupoMap['L'], bandera: 'gb-eng' },
      { nombre: 'Croacia',                  grupo: grupoMap['L'], bandera: 'hr' },
      { nombre: 'Ghana',                    grupo: grupoMap['L'], bandera: 'gh' },
      { nombre: 'Panamá',                   grupo: grupoMap['L'], bandera: 'pa' },
    ]);
    console.log('✅ 48 equipos creados');

    // Mapa de equipos por nombre
    const equipoMap = {};
    equipos.forEach(e => equipoMap[e.nombre] = e._id);

    // Crear las fases
    const fases = await Fase.insertMany([
      { nombre: 'Jornada 1 Fase de Grupos', fechaLimite: new Date('2026-06-11T20:00:00') },
      { nombre: 'Jornada 2 Fase de Grupos', fechaLimite: new Date('2026-06-18T17:00:00') },
      { nombre: 'Jornada 3 Fase de Grupos', fechaLimite: new Date('2026-06-24T20:00:00') },
      { nombre: 'Dieciseisavos',            fechaLimite: new Date('2026-07-01T00:00:00') },
      { nombre: 'Octavos',                  fechaLimite: new Date('2026-07-05T00:00:00') },
      { nombre: 'Cuartos',                  fechaLimite: new Date('2026-07-09T00:00:00') },
      { nombre: 'Semifinales',              fechaLimite: new Date('2026-07-13T00:00:00') },
      { nombre: 'Final',                    fechaLimite: new Date('2026-07-18T00:00:00') },
    ]);
    console.log('✅ Fases creadas');

    const faseMap = {};
    fases.forEach(f => faseMap[f.nombre] = f._id);

    const j1 = faseMap['Jornada 1 Fase de Grupos'];
    const j2 = faseMap['Jornada 2 Fase de Grupos'];
    const j3 = faseMap['Jornada 3 Fase de Grupos'];

    // Crear los 72 partidos de fase de grupos
    await Partido.insertMany([
      // JORNADA 1
      { fase: j1, equipoLocal: equipoMap['México'],              equipoVisitante: equipoMap['Sudáfrica'],           fechaHora: new Date('2026-06-11T21:00:00') },
      { fase: j1, equipoLocal: equipoMap['Corea del Sur'],       equipoVisitante: equipoMap['República Checa'],     fechaHora: new Date('2026-06-12T04:00:00') },
      { fase: j1, equipoLocal: equipoMap['Canadá'],              equipoVisitante: equipoMap['Bosnia y Herzegovina'],fechaHora: new Date('2026-06-12T21:00:00') },
      { fase: j1, equipoLocal: equipoMap['Estados Unidos'],      equipoVisitante: equipoMap['Paraguay'],            fechaHora: new Date('2026-06-13T03:00:00') },
      { fase: j1, equipoLocal: equipoMap['Catar'],               equipoVisitante: equipoMap['Suiza'],               fechaHora: new Date('2026-06-13T21:00:00') },
      { fase: j1, equipoLocal: equipoMap['Brasil'],              equipoVisitante: equipoMap['Marruecos'],           fechaHora: new Date('2026-06-14T00:00:00') },
      { fase: j1, equipoLocal: equipoMap['Haití'],               equipoVisitante: equipoMap['Escocia'],             fechaHora: new Date('2026-06-14T03:00:00') },
      { fase: j1, equipoLocal: equipoMap['Australia'],           equipoVisitante: equipoMap['Turquía'],             fechaHora: new Date('2026-06-14T06:00:00') },
      { fase: j1, equipoLocal: equipoMap['Alemania'],            equipoVisitante: equipoMap['Curazao'],             fechaHora: new Date('2026-06-14T19:00:00') },
      { fase: j1, equipoLocal: equipoMap['Países Bajos'],        equipoVisitante: equipoMap['Japón'],               fechaHora: new Date('2026-06-14T22:00:00') },
      { fase: j1, equipoLocal: equipoMap['Costa de Marfil'],     equipoVisitante: equipoMap['Ecuador'],             fechaHora: new Date('2026-06-15T01:00:00') },
      { fase: j1, equipoLocal: equipoMap['Suecia'],              equipoVisitante: equipoMap['Túnez'],               fechaHora: new Date('2026-06-15T04:00:00') },
      { fase: j1, equipoLocal: equipoMap['España'],              equipoVisitante: equipoMap['Cabo Verde'],          fechaHora: new Date('2026-06-15T18:00:00') },
      { fase: j1, equipoLocal: equipoMap['Bélgica'],             equipoVisitante: equipoMap['Egipto'],              fechaHora: new Date('2026-06-15T21:00:00') },
      { fase: j1, equipoLocal: equipoMap['Arabia Saudita'],      equipoVisitante: equipoMap['Uruguay'],             fechaHora: new Date('2026-06-16T00:00:00') },
      { fase: j1, equipoLocal: equipoMap['Irán'],                equipoVisitante: equipoMap['Nueva Zelanda'],       fechaHora: new Date('2026-06-16T03:00:00') },
      { fase: j1, equipoLocal: equipoMap['Francia'],             equipoVisitante: equipoMap['Senegal'],             fechaHora: new Date('2026-06-16T21:00:00') },
      { fase: j1, equipoLocal: equipoMap['Irak'],                equipoVisitante: equipoMap['Noruega'],             fechaHora: new Date('2026-06-17T00:00:00') },
      { fase: j1, equipoLocal: equipoMap['Argentina'],           equipoVisitante: equipoMap['Argelia'],             fechaHora: new Date('2026-06-17T03:00:00') },
      { fase: j1, equipoLocal: equipoMap['Austria'],             equipoVisitante: equipoMap['Jordania'],            fechaHora: new Date('2026-06-17T06:00:00') },
      { fase: j1, equipoLocal: equipoMap['Portugal'],            equipoVisitante: equipoMap['Rep. Democrática del Congo'], fechaHora: new Date('2026-06-17T19:00:00') },
      { fase: j1, equipoLocal: equipoMap['Inglaterra'],          equipoVisitante: equipoMap['Croacia'],             fechaHora: new Date('2026-06-17T22:00:00') },
      { fase: j1, equipoLocal: equipoMap['Ghana'],               equipoVisitante: equipoMap['Panamá'],              fechaHora: new Date('2026-06-18T01:00:00') },
      { fase: j1, equipoLocal: equipoMap['Uzbekistán'],          equipoVisitante: equipoMap['Colombia'],            fechaHora: new Date('2026-06-18T04:00:00') },

      // JORNADA 2
      { fase: j2, equipoLocal: equipoMap['República Checa'],     equipoVisitante: equipoMap['Sudáfrica'],           fechaHora: new Date('2026-06-18T18:00:00') },
      { fase: j2, equipoLocal: equipoMap['Suiza'],               equipoVisitante: equipoMap['Bosnia y Herzegovina'],fechaHora: new Date('2026-06-18T21:00:00') },
      { fase: j2, equipoLocal: equipoMap['Canadá'],              equipoVisitante: equipoMap['Catar'],               fechaHora: new Date('2026-06-19T00:00:00') },
      { fase: j2, equipoLocal: equipoMap['México'],              equipoVisitante: equipoMap['Corea del Sur'],       fechaHora: new Date('2026-06-19T03:00:00') },
      { fase: j2, equipoLocal: equipoMap['Estados Unidos'],      equipoVisitante: equipoMap['Australia'],           fechaHora: new Date('2026-06-19T21:00:00') },
      { fase: j2, equipoLocal: equipoMap['Escocia'],             equipoVisitante: equipoMap['Marruecos'],           fechaHora: new Date('2026-06-20T00:00:00') },
      { fase: j2, equipoLocal: equipoMap['Brasil'],              equipoVisitante: equipoMap['Haití'],               fechaHora: new Date('2026-06-20T02:30:00') },
      { fase: j2, equipoLocal: equipoMap['Turquía'],             equipoVisitante: equipoMap['Paraguay'],            fechaHora: new Date('2026-06-20T05:00:00') },
      { fase: j2, equipoLocal: equipoMap['Países Bajos'],        equipoVisitante: equipoMap['Suecia'],              fechaHora: new Date('2026-06-20T19:00:00') },
      { fase: j2, equipoLocal: equipoMap['Alemania'],            equipoVisitante: equipoMap['Costa de Marfil'],     fechaHora: new Date('2026-06-20T22:00:00') },
      { fase: j2, equipoLocal: equipoMap['Ecuador'],             equipoVisitante: equipoMap['Curazao'],             fechaHora: new Date('2026-06-21T02:00:00') },
      { fase: j2, equipoLocal: equipoMap['Túnez'],               equipoVisitante: equipoMap['Japón'],               fechaHora: new Date('2026-06-21T06:00:00') },
      { fase: j2, equipoLocal: equipoMap['España'],              equipoVisitante: equipoMap['Arabia Saudita'],      fechaHora: new Date('2026-06-21T18:00:00') },
      { fase: j2, equipoLocal: equipoMap['Bélgica'],             equipoVisitante: equipoMap['Irán'],                fechaHora: new Date('2026-06-21T21:00:00') },
      { fase: j2, equipoLocal: equipoMap['Uruguay'],             equipoVisitante: equipoMap['Cabo Verde'],          fechaHora: new Date('2026-06-22T00:00:00') },
      { fase: j2, equipoLocal: equipoMap['Nueva Zelanda'],       equipoVisitante: equipoMap['Egipto'],              fechaHora: new Date('2026-06-22T03:00:00') },
      { fase: j2, equipoLocal: equipoMap['Argentina'],           equipoVisitante: equipoMap['Austria'],             fechaHora: new Date('2026-06-22T19:00:00') },
      { fase: j2, equipoLocal: equipoMap['Francia'],             equipoVisitante: equipoMap['Irak'],                fechaHora: new Date('2026-06-22T23:00:00') },
      { fase: j2, equipoLocal: equipoMap['Noruega'],             equipoVisitante: equipoMap['Senegal'],             fechaHora: new Date('2026-06-23T02:00:00') },
      { fase: j2, equipoLocal: equipoMap['Jordania'],            equipoVisitante: equipoMap['Argelia'],             fechaHora: new Date('2026-06-23T05:00:00') },
      { fase: j2, equipoLocal: equipoMap['Portugal'],            equipoVisitante: equipoMap['Uzbekistán'],          fechaHora: new Date('2026-06-23T19:00:00') },
      { fase: j2, equipoLocal: equipoMap['Inglaterra'],          equipoVisitante: equipoMap['Ghana'],               fechaHora: new Date('2026-06-23T22:00:00') },
      { fase: j2, equipoLocal: equipoMap['Panamá'],              equipoVisitante: equipoMap['Croacia'],             fechaHora: new Date('2026-06-24T01:00:00') },
      { fase: j2, equipoLocal: equipoMap['Colombia'],            equipoVisitante: equipoMap['Rep. Democrática del Congo'], fechaHora: new Date('2026-06-24T04:00:00') },

      // JORNADA 3
      { fase: j3, equipoLocal: equipoMap['Bosnia y Herzegovina'],equipoVisitante: equipoMap['Catar'],               fechaHora: new Date('2026-06-24T21:00:00') },
      { fase: j3, equipoLocal: equipoMap['Suiza'],               equipoVisitante: equipoMap['Canadá'],              fechaHora: new Date('2026-06-24T21:00:00') },
      { fase: j3, equipoLocal: equipoMap['Escocia'],             equipoVisitante: equipoMap['Brasil'],              fechaHora: new Date('2026-06-25T00:00:00') },
      { fase: j3, equipoLocal: equipoMap['Marruecos'],           equipoVisitante: equipoMap['Haití'],               fechaHora: new Date('2026-06-25T00:00:00') },
      { fase: j3, equipoLocal: equipoMap['República Checa'],     equipoVisitante: equipoMap['México'],              fechaHora: new Date('2026-06-25T03:00:00') },
      { fase: j3, equipoLocal: equipoMap['Sudáfrica'],           equipoVisitante: equipoMap['Corea del Sur'],       fechaHora: new Date('2026-06-25T03:00:00') },
      { fase: j3, equipoLocal: equipoMap['Curazao'],             equipoVisitante: equipoMap['Costa de Marfil'],     fechaHora: new Date('2026-06-25T22:00:00') },
      { fase: j3, equipoLocal: equipoMap['Ecuador'],             equipoVisitante: equipoMap['Alemania'],            fechaHora: new Date('2026-06-25T22:00:00') },
      { fase: j3, equipoLocal: equipoMap['Japón'],               equipoVisitante: equipoMap['Suecia'],              fechaHora: new Date('2026-06-26T01:00:00') },
      { fase: j3, equipoLocal: equipoMap['Túnez'],               equipoVisitante: equipoMap['Países Bajos'],        fechaHora: new Date('2026-06-26T01:00:00') },
      { fase: j3, equipoLocal: equipoMap['Paraguay'],            equipoVisitante: equipoMap['Australia'],           fechaHora: new Date('2026-06-26T04:00:00') },
      { fase: j3, equipoLocal: equipoMap['Turquía'],             equipoVisitante: equipoMap['Estados Unidos'],      fechaHora: new Date('2026-06-26T04:00:00') },
      { fase: j3, equipoLocal: equipoMap['Noruega'],             equipoVisitante: equipoMap['Francia'],             fechaHora: new Date('2026-06-26T21:00:00') },
      { fase: j3, equipoLocal: equipoMap['Senegal'],             equipoVisitante: equipoMap['Irak'],                fechaHora: new Date('2026-06-26T21:00:00') },
      { fase: j3, equipoLocal: equipoMap['Cabo Verde'],          equipoVisitante: equipoMap['Arabia Saudita'],      fechaHora: new Date('2026-06-27T02:00:00') },
      { fase: j3, equipoLocal: equipoMap['Uruguay'],             equipoVisitante: equipoMap['España'],              fechaHora: new Date('2026-06-27T02:00:00') },
      { fase: j3, equipoLocal: equipoMap['Egipto'],              equipoVisitante: equipoMap['Irán'],                fechaHora: new Date('2026-06-27T05:00:00') },
      { fase: j3, equipoLocal: equipoMap['Nueva Zelanda'],       equipoVisitante: equipoMap['Bélgica'],             fechaHora: new Date('2026-06-27T05:00:00') },
      { fase: j3, equipoLocal: equipoMap['Croacia'],             equipoVisitante: equipoMap['Ghana'],               fechaHora: new Date('2026-06-27T23:00:00') },
      { fase: j3, equipoLocal: equipoMap['Panamá'],              equipoVisitante: equipoMap['Inglaterra'],          fechaHora: new Date('2026-06-27T23:00:00') },
      { fase: j3, equipoLocal: equipoMap['Colombia'],            equipoVisitante: equipoMap['Portugal'],            fechaHora: new Date('2026-06-28T01:30:00') },
      { fase: j3, equipoLocal: equipoMap['Rep. Democrática del Congo'], equipoVisitante: equipoMap['Uzbekistán'],   fechaHora: new Date('2026-06-28T01:30:00') },
      { fase: j3, equipoLocal: equipoMap['Argelia'],             equipoVisitante: equipoMap['Austria'],             fechaHora: new Date('2026-06-28T04:00:00') },
      { fase: j3, equipoLocal: equipoMap['Jordania'],            equipoVisitante: equipoMap['Argentina'],           fechaHora: new Date('2026-06-28T04:00:00') },
    ]);
    console.log('✅ 72 partidos de fase de grupos creados');
    const Prediccion = require('./models/Prediccion');
    const PrediccionEspecial = require('./models/PrediccionEspecial');
    const Usuario = require('./models/Usuario');

    // Limpiar predicciones y resetear puntos
    await Prediccion.deleteMany({});
    await PrediccionEspecial.deleteMany({});
    await Usuario.updateMany({}, { puntosTotales: 0 });
    console.log('🗑️ Predicciones eliminadas y puntos reseteados');
    console.log('🎉 Seed completado con éxito');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    process.exit(1);
  }
};

seedData();