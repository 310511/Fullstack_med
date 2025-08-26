#!/usr/bin/env python3
"""
Drone Management System Launcher
Starts the backend server and opens the dashboard
"""

import subprocess
import sys
import time
import webbrowser
import os
from pathlib import Path

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements_backend.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        return False
    return True

def start_backend_server():
    """Start the Flask backend server"""
    print("🚁 Starting Drone Management Backend Server...")
    
    # Get the current directory
    current_dir = Path(__file__).parent
    
    try:
        # Start the backend server in a subprocess
        backend_process = subprocess.Popen([
            sys.executable, 
            str(current_dir / "backend_server.py")
        ], 
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
        )
        
        # Wait a moment for the server to start
        time.sleep(3)
        
        # Check if the server is running
        try:
            import requests
            response = requests.get("http://localhost:5000/api/status", timeout=5)
            if response.status_code == 200:
                print("✅ Backend server started successfully!")
                print("📍 Server running at: http://localhost:5000")
                return backend_process
            else:
                print("❌ Backend server failed to start properly")
                return None
        except ImportError:
            print("⚠️  requests module not available, skipping server check")
            return backend_process
        except Exception as e:
            print(f"❌ Backend server check failed: {e}")
            return None
            
    except Exception as e:
        print(f"❌ Failed to start backend server: {e}")
        return None

def open_dashboard():
    """Open the drone dashboard in the browser"""
    print("🌐 Opening Drone Dashboard...")
    
    # Get the current directory
    current_dir = Path(__file__).parent
    dashboard_path = current_dir / "drone_dashboard.html"
    
    if dashboard_path.exists():
        # Convert to file URL
        file_url = f"file:///{dashboard_path.absolute().as_posix()}"
        webbrowser.open(file_url)
        print("✅ Dashboard opened in browser")
        print(f"📍 Dashboard URL: {file_url}")
    else:
        print("❌ Dashboard file not found")
        return False
    return True

def main():
    """Main launcher function"""
    print("=" * 50)
    print("🚁 DRONE MANAGEMENT SYSTEM LAUNCHER")
    print("=" * 50)
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements. Exiting.")
        return
    
    # Start backend server
    backend_process = start_backend_server()
    if not backend_process:
        print("❌ Failed to start backend server. Exiting.")
        return
    
    # Open dashboard
    if not open_dashboard():
        print("❌ Failed to open dashboard.")
        return
    
    print("\n" + "=" * 50)
    print("🎉 DRONE MANAGEMENT SYSTEM STARTED!")
    print("=" * 50)
    print("📊 Dashboard: Open in your browser")
    print("🔧 Backend: http://localhost:5000")
    print("🛑 To stop: Press Ctrl+C in this terminal")
    print("=" * 50)
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down Drone Management System...")
        if backend_process:
            backend_process.terminate()
            print("✅ Backend server stopped")
        print("👋 Goodbye!")

if __name__ == "__main__":
    main()
