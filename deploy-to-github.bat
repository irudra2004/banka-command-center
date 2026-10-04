@echo off
title Deploy Banka Command Center to GitHub (irudra2004)
echo =====================================================================
echo    Deploy Banka Command Center to GitHub: irudra2004
echo =====================================================================
echo.
echo Remote repository configured:
echo https://github.com/irudra2004/banka-command-center.git
echo.
echo Make sure you have created the repository on your GitHub:
echo 👉 https://github.com/new (Name: banka-command-center)
echo.
echo Press any key to push code to GitHub...
pause >nul

echo.
echo Pushing code to https://github.com/irudra2004/banka-command-center.git...
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/irudra2004/banka-command-center.git
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo =====================================================================
echo Done! Your code is now deployed to https://github.com/irudra2004/banka-command-center
echo.
echo To enable your Free Live Website on GitHub Pages:
echo 1. Open: https://github.com/irudra2004/banka-command-center/settings/pages
echo 2. Under 'Build and deployment' -^> Source, select: GitHub Actions
echo 3. Your site will automatically go live at:
echo    https://irudra2004.github.io/banka-command-center/
echo =====================================================================
pause
