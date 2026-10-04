@echo off
title Push Banka Command Center to GitHub
echo =====================================================================
echo    Deploy Banka Command Center to GitHub Account (Rudraaryan24)
echo =====================================================================
echo.
echo Make sure you have created an empty repository on GitHub first:
echo 👉 https://github.com/new
echo Suggested Repository Name: banka-command-center
echo.
set /p REPO_URL="Enter your GitHub Repository URL (Press Enter for https://github.com/Rudraaryan24/banka-command-center.git): "
if "%REPO_URL%"=="" set REPO_URL=https://github.com/Rudraaryan24/banka-command-center.git

echo.
echo Setting remote origin to: %REPO_URL%
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin %REPO_URL%
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo.
echo Pushing code to GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo =====================================================================
echo Done! If push succeeded, your repository is live on GitHub!
echo To enable GitHub Pages (Free Live Website):
echo 1. Go to your repo on GitHub: Settings -> Pages
echo 2. Under 'Source', select 'GitHub Actions'
echo 3. The site will automatically build and publish!
echo =====================================================================
pause
