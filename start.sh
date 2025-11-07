#!/bin/bash

# Script de inicio rápido para el Sistema de Notificaciones
# BenjaMin_0201

echo "🚀 Iniciando Sistema de Notificaciones..."
echo ""

# Verificar si MongoDB está ejecutándose
echo "📊 Verificando MongoDB..."
if ! pgrep mongod > /dev/null 2>&1; then
    echo "⚠️  MongoDB no está ejecutándose. Por favor, inicia MongoDB primero:"
    echo "   - Windows: net start MongoDB"
    echo "   - Linux: sudo systemctl start mongod"
    echo "   - macOS: brew services start mongodb-community"
    echo ""
    read -p "Presiona Enter cuando MongoDB esté ejecutándose..."
fi

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Cerrando aplicaciones..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

echo "🔧 Iniciando Backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Esperar un momento para que el backend se inicie
sleep 3

echo "🌐 Iniciando Frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Aplicación iniciada!"
echo "📋 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:3001"
echo ""
echo "📝 Usuarios de prueba:"
echo "   Admin: admin@test.com / password123"
echo "   User: user@test.com / password123"
echo ""
echo "🛑 Presiona Ctrl+C para detener ambas aplicaciones"

# Mantener el script ejecutándose
wait
