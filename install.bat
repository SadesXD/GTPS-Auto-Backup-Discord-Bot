@echo off
echo install the requirement package
npm install
npm audit fix
cls
echo Done..
pause
