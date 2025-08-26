@echo off
echo ==================================================
echo 🚁 DRONE MANAGEMENT SYSTEM LAUNCHER
echo ==================================================
echo.

echo 📦 Installing required packages...
pip install -r requirements_backend.txt

echo.
echo 🚁 Starting Drone Management Backend Server...
echo 📍 Server will be available at: http://localhost:5000
echo.

echo 🌐 Opening Drone Dashboard...
start drone_dashboard.html

echo.
echo 🎉 DRONE MANAGEMENT SYSTEM STARTED!
echo ==================================================
echo 📊 Dashboard: Open in your browser
echo 🔧 Backend: http://localhost:5000
echo 🛑 To stop: Close this window and stop the backend
echo ==================================================
echo.

echo Starting backend server...
python backend_server.py

pause
