const nodemailer = require('nodemailer');
// Configurar transporter con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4
});
// Enviar email de verificación
const enviarEmailVerificacion = async (email, nombre, token) => {
  const enlace = `${process.env.URL_FRONTEND}/verificar?token=${token}`;

  await transporter.sendMail({
    from: `"Porra Mundial 2026" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '<img src="logo.png" alt="Logo" class="w-24 h-24 mx-auto"> Verifica tu cuenta - Porra Mundial 2026',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a1628; color: white; padding: 30px; border-radius: 12px;">
        <h1 style="color: #ffd700; text-align: center;"><img src="logo.png" alt="Logo" class="w-24 h-24 mx-auto"> Porra Mundial 2026</h1>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Gracias por registrarte. Haz clic en el botón para verificar tu cuenta:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${enlace}" style="background: #e63946; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Verificar mi cuenta
          </a>
        </div>
        <p style="color: #888; font-size: 12px;">Si no te has registrado ignora este email.</p>
      </div>
    `
  });
};

module.exports = { enviarEmailVerificacion, transporter };