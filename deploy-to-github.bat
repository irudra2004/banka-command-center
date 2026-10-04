@echo off
title Deploy Banka Command Center to GitHub
echo =====================================================================
echo    Deploy Banka Command Center to Your GitHub Account
echo =====================================================================
echo.
echo 1. Go to GitHub and create a new repository:
echo    https://github.com/new
echo 2. Set repository name (e.g. banka-command-center) and click Create.
echo 3. Copy your repository HTTPS URL.
echo.
set /p REPO_URL="Paste your GitHub Repository URL: "
if "%REPO_URL%"=="" (
    echo Error: No URL provided. Exiting.
    pause
    exit /b
)

echo.
echo Setting remote origin to: %REPO_URL%
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin %REPO_URL%
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo.
echo Pushing code to your repository...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo =====================================================================
echo Done! Your code is now deployed to your GitHub repository!
echo.
echo To enable GitHub Pages (Free Live Website):
echo 1. Open your repository on GitHub: Settings -^> Pages
echo 2. Under 'Build and deployment' -^> Source, choose: GitHub Actions
echo 3. The automated workflow will publish your site online!
echo =====================================================================
pause
