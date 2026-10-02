#!/usr/bin/env node
/**
 * 🔒 HTTPS Development Server
 * Sirve la aplicación Next.js con HTTPS para permitir:
 * - Geolocalización (navigator.geolocation requiere HTTPS)
 * - Permisos de navegador (cámara, micrófono, etc.)
 *
 * Uso: npm run dev:https
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { createServer } = require('http');

// Importar next
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000');
const certDir = path.join(__dirname, '.certificates');

// Crear app Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Leer certificados
const certPath = path.join(certDir, 'localhost.pem');
const keyPath = path.join(certDir, 'localhost-key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.error('❌ Certificados SSL no encontrados en .certificates/');
  console.error('Ejecuta primero: npm run gen-certs');
  process.exit(1);
}

const cert = fs.readFileSync(certPath);
const key = fs.readFileSync(keyPath);

app.prepare().then(() => {
  const server = https.createSecureServer(
    {
      key,
      cert,
      // Permitir conexiones a localhost con certificado autofirmado
      rejectUnauthorized: false
    },
    async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }
  );

  server.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                  🔒 HTTPS DEV SERVER RUNNING               ║
╚════════════════════════════════════════════════════════════╝

✅ https://localhost:${port}

📍 Geolocalización: HABILITADA
🎥 Permisos de navegador: HABILITADOS
🔐 Certificado: Autofirmado (localhost)

⚠️  NOTA: Tu navegador podría mostrar una advertencia de certificado.
   Esto es normal en desarrollo. Continúa de todos modos.

📚 Docs: https://localhost:${port}/nosotros
🔍 GPS Test: https://localhost:${port}/agencias
    `);
  });
});
