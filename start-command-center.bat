@echo off
title Banka District Command Center
echo =====================================================================
echo    District Administration, Banka - Field Duty Monitoring System
echo =====================================================================
echo Starting local command dashboard server...
cd /d "%~dp0"

start http://localhost:5173/
npm run dev -- --host --port 5173
pause
