@echo off
REM ===================================================================
REM Build script for Taskify - запуск сборки
REM ===================================================================

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           TASKIFY BUILD SYSTEM                                 ║
echo ║         Choose platform to build                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 1) Android APK (Release)
echo 2) iOS IPA (Release)
echo 3) Both (Android + iOS)
echo 4) Android APK (Debug - faster)
echo 5) Check build status
echo 6) View last build logs
echo.
set /p choice="Enter choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo [BUILD] Starting Android APK Release Build...
    echo.
    call npx eas build --platform android --release
    
) else if "%choice%"=="2" (
    echo.
    echo [BUILD] Starting iOS IPA Release Build...
    echo.
    call npx eas build --platform ios --release
    
) else if "%choice%"=="3" (
    echo.
    echo [BUILD] Starting Android + iOS Release Build...
    echo.
    call npx eas build --platform all --release
    
) else if "%choice%"=="4" (
    echo.
    echo [BUILD] Starting Android APK Debug Build (faster)...
    echo.
    call npx eas build --platform android
    
) else if "%choice%"=="5" (
    echo.
    echo [STATUS] Checking build history...
    echo.
    call npx eas build:list
    
) else if "%choice%"=="6" (
    echo.
    echo [LOGS] Getting last build ID...
    call npx eas build:list --limit 1
    
) else (
    echo Invalid choice!
    exit /b 1
)

echo.
echo [DONE] Build process completed!
echo.
pause
