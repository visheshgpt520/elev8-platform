@echo off
echo ===================================================
echo ELEV8 CORE PLATFORM - EXECUTING ALL MICROSERVICES
echo ===================================================

echo [1/4] Starting MySQL Database Container...
docker-compose up -d

echo.
echo [2/4] Starting CodeIgniter 4 Economy API (Port 8080)...
start "PHP Economy Backend" cmd /k "cd backend-php-economy && php spark serve --port 8080"

echo.
echo [3/4] Starting Node.js Realtime Server (Port 3001)...
start "Node.js Realtime Matchmaker" cmd /k "cd backend-node-realtime && npm install && npm start"

echo.
echo [4/4] Starting React + Vite Frontend (Port 5173)...
start "React Frontend Web" cmd /k "cd frontend-web && npm install && npm run dev"

echo.
echo ===================================================
echo ALL SYSTEMS GO. 
echo Let the services boot up for a few seconds.
echo Frontend should be available at: http://localhost:5173
echo ===================================================
pause
