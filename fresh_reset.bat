@echo off
setlocal enabledelayedexpansion

cd /d "J:\freelancing\impressions_website\non_lovable"

echo ==========================================
echo Fresh repo reset for:
echo %cd%
echo ==========================================
echo.

echo This will remove generated junk folders and files.
echo It can also remove old Git history.
echo.

set /p CONFIRM=Type YES to continue: 
if /I not "%CONFIRM%"=="YES" (
    echo Cancelled.
    pause
    exit /b
)

echo.
echo [1/8] Removing generated folders...

if exist "node_modules\" rmdir /s /q "node_modules"
if exist "dist\" rmdir /s /q "dist"
if exist "build\" rmdir /s /q "build"
if exist ".vercel\" rmdir /s /q ".vercel"
if exist ".next\" rmdir /s /q ".next"
if exist ".nuxt\" rmdir /s /q ".nuxt"
if exist ".cache\" rmdir /s /q ".cache"
if exist ".turbo\" rmdir /s /q ".turbo"
if exist "coverage\" rmdir /s /q "coverage"
if exist "__pycache__\" rmdir /s /q "__pycache__"
if exist ".pytest_cache\" rmdir /s /q ".pytest_cache"
if exist ".mypy_cache\" rmdir /s /q ".mypy_cache"

echo [2/8] Removing common junk files...

if exist "npm-debug.log" del /f /q "npm-debug.log"
if exist "yarn-error.log" del /f /q "yarn-error.log"
if exist "pnpm-debug.log" del /f /q "pnpm-debug.log"
if exist ".DS_Store" del /f /q ".DS_Store"
if exist "Thumbs.db" del /f /q "Thumbs.db"

echo [3/8] Ensuring .gitignore exists...

if not exist ".gitignore" (
    (
        echo node_modules/
        echo dist/
        echo build/
        echo .vercel/
        echo .next/
        echo .nuxt/
        echo .cache/
        echo .turbo/
        echo coverage/
        echo __pycache__/
        echo .pytest_cache/
        echo .mypy_cache/
        echo .env.local
        echo .env.*.local
    ) > .gitignore
) else (
    findstr /x /c:"node_modules/" ".gitignore" >nul || echo node_modules/>>.gitignore
    findstr /x /c:"dist/" ".gitignore" >nul || echo dist/>>.gitignore
    findstr /x /c:"build/" ".gitignore" >nul || echo build/>>.gitignore
    findstr /x /c:".vercel/" ".gitignore" >nul || echo .vercel/>>.gitignore
    findstr /x /c:".next/" ".gitignore" >nul || echo .next/>>.gitignore
    findstr /x /c:".nuxt/" ".gitignore" >nul || echo .nuxt/>>.gitignore
    findstr /x /c:".cache/" ".gitignore" >nul || echo .cache/>>.gitignore
    findstr /x /c:".turbo/" ".gitignore" >nul || echo .turbo/>>.gitignore
    findstr /x /c:"coverage/" ".gitignore" >nul || echo coverage/>>.gitignore
    findstr /x /c:"__pycache__/" ".gitignore" >nul || echo __pycache__/>>.gitignore
    findstr /x /c:".pytest_cache/" ".gitignore" >nul || echo .pytest_cache/>>.gitignore
    findstr /x /c:".mypy_cache/" ".gitignore" >nul || echo .mypy_cache/>>.gitignore
)

echo [4/8] Optional lockfile reset...
set /p RESETLOCK=Delete package-lock.json and regenerate dependencies? (Y/N): 
if /I "%RESETLOCK%"=="Y" (
    if exist "package-lock.json" del /f /q "package-lock.json"
)

echo [5/8] Optional Git reset...
set /p RESETGIT=Delete old .git history and create a fresh repo? (Y/N): 
if /I "%RESETGIT%"=="Y" (
    if exist ".git\" rmdir /s /q ".git"
)

echo [6/8] Installing dependencies...
if exist "package.json" (
    call npm install
) else (
    echo package.json not found. Skipping npm install.
)

echo [7/8] Testing production build...
if exist "package.json" (
    call npm run build
)

echo [8/8] Re-initializing Git if needed...
if not exist ".git\" (
    git init
    git add .
    git commit -m "fresh clean repo"
)

echo.
echo Done.
echo Check the project now, then create a new GitHub repo and push it.
pause