@echo off
where node.exe >nul 2>&1 || echo [ERROR] Please install node js first before using this App && exit /B
cd.. && node index.js
pause
