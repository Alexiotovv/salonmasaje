@echo off
REM Script de inicio rápido para Windows
REM Sistema de Notificaciones - BenjaMin_0201

echo 🚀 Iniciando Sistema de Notificaciones...
echo.

echo 📊 Verificando MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo ⚠️  MongoDB no está ejecutándose. Por favor, inicia MongoDB primero:
    echo    - net start MongoDB
    echo    - O ejecuta mongod.exe manualmente
    echo.
    pause
)

echo 🔧 Iniciando Backend...
cd backend
start "Backend" cmd /k "npm run dev"

echo 🌐 Esperando 3 segundos antes de iniciar Frontend...
timeout /t 3 /nobreak > nul

echo 🌐 Iniciando Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm start"

echo.
echo ✅ Aplicación iniciada!
echo 📋 Backend: http://localhost:3000
echo 🌐 Frontend: http://localhost:3001
echo.
echo 📝 Usuarios de prueba:
echo    Admin: admin@test.com / password123
echo    User: user@test.com / password123
echo.
echo 🛑 Cierra las ventanas de comandos para detener las aplicaciones
echo.
pause
