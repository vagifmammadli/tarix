@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20.19+ or 22.12+ is required. Install it from https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules (
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo.
echo TARIX - Interactive Museum
echo Open the Local address printed below in your browser.
echo For phones on the same Wi-Fi, use the Network address.
echo Keep this window open while presenting. Ctrl+C stops the server.
echo.
call npm run dev
pause
