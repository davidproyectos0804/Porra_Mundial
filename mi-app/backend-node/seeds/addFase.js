const mongoose = require('mongoose');
require('dotenv').config();

const Fase = require('../models/Fase');

const NUEVA_FASE = {
  nombre: '3er Puesto',
  fechaLimite: new Date('2026-07-18T23:00:00') // ajusta si cambia el horario oficial
};

const addFase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    const existe = await Fase.findOne({ nombre: NUEVA_FASE.nombre });
    if (existe) {
      console.log(`⚠️ La fase "${NUEVA_FASE.nombre}" ya existe. No se ha hecho nada.`);
      process.exit(0);
    }

    const fase = await Fase.create(NUEVA_FASE);
    console.log(`✅ Fase creada: ${fase.nombre} (id: ${fase._id})`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear la fase:', error.message);
    process.exit(1);
  }
};

addFase();