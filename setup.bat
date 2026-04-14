@echo off
setlocal
set "PROJECT_ROOT=%~dp0"

echo ============================================================
echo   ScribeConnect - Full Stack Project Setup
echo ============================================================
echo.

:: 1. Check for Node.js
echo [1/3] Checking Prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js found.
)

:: 2. Check for Java

where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed. Please install JDK 17 or higher.
    pause
    exit /b 1
) else (
    echo [OK] Java found.
)

:: 3. Setup Frontend
echo.
echo [2/3] Setting up Frontend (React + Tailwind)...
cd "%PROJECT_ROOT%frontend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend installation failed.
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed.

:: 4. Setup Backend
echo.
echo [3/3] Setting up Backend (Spring Boot)...
cd "%PROJECT_ROOT%backend"
echo (Note: If Maven is not installed, this step will be skipped but directory structure is ready)
where mvn >nul 2>nul
if %errorlevel% eq 0 (
    call mvn clean install -DskipTests
    if %errorlevel% neq 0 (
        echo [WARNING] Maven build failed, but structure is correct.
    ) else (
        echo [OK] Backend built successfully.
    )
) else (
    echo [SKIP] Maven not found. Please install Maven or use your IDE to build.
)

echo.
echo ============================================================
echo   SETUP COMPLETE!
echo ============================================================
echo.
echo To run the Frontend:
echo   1. cd frontend
echo   2. npm run dev
echo.
echo To run the Backend:
echo   1. Open the "backend" folder in your IDE (IntelliJ/Eclipse)
echo   2. Run ScribeAllocationApplication.java
echo.
pause
