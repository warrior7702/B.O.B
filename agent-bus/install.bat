@echo off
setlocal
echo ============================================
echo  AgentBus Installer - FBCA Agent Message Bus
echo ============================================
echo.

:: Check Node version
for /f "tokens=1 delims=v" %%a in ('node --version 2^>nul') do set NODEVER=%%a
for /f "tokens=1 delims=." %%a in ('node --version 2^>nul') do set NODEMAJ=%%a
if "%NODEMAJ%"=="" (
    echo ERROR: Node.js not found. Install v22+ from https://nodejs.org
    pause & exit /b 1
)

echo Node.js found. Checking version...
node -e "const v=parseInt(process.version.slice(1)); if(v<22){console.error('Need Node 22+, got '+process.version);process.exit(1);} else console.log('Node '+process.version+' OK');"
if %errorlevel% neq 0 (
    echo ERROR: Node.js 22+ required. Download from https://nodejs.org
    pause & exit /b 1
)

:: Quick smoke test
echo.
echo [1/3] Testing server starts cleanly...
timeout /t 1 /nobreak >nul
node -e "const {DatabaseSync}=require('node:sqlite'); const db=new DatabaseSync(':memory:'); console.log('SQLite OK');"
if %errorlevel% neq 0 (
    echo ERROR: node:sqlite not available. Upgrade Node to v22.5+
    pause & exit /b 1
)

:: Install PM2
echo.
echo [2/3] Installing PM2 process manager...
npm install -g pm2 --quiet
if %errorlevel% neq 0 (
    echo WARNING: PM2 install failed. Will start without auto-restart.
    goto :start_direct
)

:: Start with PM2
echo.
echo [3/3] Starting AgentBus with PM2...
pm2 start server.js --name agent-bus --restart-delay 3000 --max-restarts 10
pm2 save

:: Set up Windows startup
echo.
echo Setting up auto-start on Windows boot...
pm2 startup
pm2 save

goto :done

:start_direct
echo.
echo [3/3] Starting AgentBus directly (no auto-restart)...
start "AgentBus" /MIN node server.js

:done
echo.
echo ============================================
echo  AgentBus is running!
echo.
echo  Local:    http://localhost:4747/health
echo  Network:  http://100.90.196.118:4747/health
echo.
echo  All agents should now point to:
echo  http://100.90.196.118:4747
echo ============================================
echo.
pause
