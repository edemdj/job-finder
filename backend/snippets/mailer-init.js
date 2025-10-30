// mailer initialization (paste into backend/src/routes/publicApplications.js, replacing existing mailer code)
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5000';
const MAILTRAP_HOST = process.env.MAILTRAP_HOST || 'live.smtp.mailtrap.io';
const MAILTRAP_PORT = Number(process.env.MAILTRAP_PORT || 587);
const MAILTRAP_API_TOKEN = process.env.MAILTRAP_API_TOKEN;
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@example.test';

let mailer = null;

if (MAILTRAP_API_TOKEN && MAILTRAP_HOST) {
  mailer = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    secure: MAILTRAP_PORT === 465, // true for 465
    auth: {
      user: 'api', // Mailtrap expects 'api' as the user for the live SMTP token
      pass: MAILTRAP_API_TOKEN,
    },
  });

  // Verify once at startup so we fail fast in logs (non-blocking)
  mailer.verify()
    .then(() => console.log('Mailer SMTP prêt (Mailtrap)'))
    .catch((err) => {
      console.error('Impossible de vérifier le SMTP (Mailtrap) — les notifications par email seront désactivées :', err && err.message ? err.message : err);
      mailer = null; // désactive les envois pour éviter des erreurs répétées
    });
} else {
  console.warn('MAILTRAP_API_TOKEN ou MAILTRAP_HOST non fournis — notifications par email désactivées.');
}