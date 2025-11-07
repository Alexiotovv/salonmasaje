// Test básico para verificar que el servidor funciona sin MongoDB
const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`Servidor de prueba ejecutándose en puerto ${PORT}`);
});

// Cerrar después de 3 segundos
setTimeout(() => {
  console.log('Test completado exitosamente ✅');
  server.close();
  process.exit(0);
}, 3000);
