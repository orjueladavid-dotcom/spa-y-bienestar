import { app } from './app.js';

const PORT = Number(process.env['PORT']) || 3000;

const server = app.listen(PORT, () => {
  console.log(`🌿 Spay Bienestar API (Semana 03) en http://localhost:${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/health`);
  console.log(`   Treatments: http://localhost:${PORT}/api/v1/treatments`);
});

function shutdown(signal: string): void {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(() => {
    console.log('Servidor cerrado correctamente.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
