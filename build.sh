#!/bin/bash
# ===================================================================
# Build script for Taskify - запуск сборки (для Mac/Linux)
# ===================================================================

clear

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           TASKIFY BUILD SYSTEM                                 ║"
echo "║         Choose platform to build                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "1) Android APK (Release)"
echo "2) iOS IPA (Release)"
echo "3) Both (Android + iOS)"
echo "4) Android APK (Debug - faster)"
echo "5) Check build status"
echo "6) View last build logs"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "[BUILD] Starting Android APK Release Build..."
        echo ""
        npx eas build --platform android --release
        ;;
    2)
        echo ""
        echo "[BUILD] Starting iOS IPA Release Build..."
        echo ""
        npx eas build --platform ios --release
        ;;
    3)
        echo ""
        echo "[BUILD] Starting Android + iOS Release Build..."
        echo ""
        npx eas build --platform all --release
        ;;
    4)
        echo ""
        echo "[BUILD] Starting Android APK Debug Build (faster)..."
        echo ""
        npx eas build --platform android
        ;;
    5)
        echo ""
        echo "[STATUS] Checking build history..."
        echo ""
        npx eas build:list
        ;;
    6)
        echo ""
        echo "[LOGS] Getting last build ID..."
        npx eas build:list --limit 1
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "[DONE] Build process completed!"
echo ""
