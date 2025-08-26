#!/usr/bin/env python3
"""
Drone Backend Launcher for Codezilla Spider Project
Starts the drone management backend server
"""

import subprocess
import sys
import time
import os
from pathlib import Path

def install_requirements():
    """Install required packages"""
    print("📦 Installing drone backend requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements_backend.txt"])
        print("✅ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        return False

def start_backend_server():
    """Start the Flask backend server"""
    print("🚁 Starting Drone Management Backend Server...")
    
    try:
        # Start the backend server
        subprocess.run([
            sys.executable, 
            "backend_server.py"
        ])
        
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Failed to start backend server: {e}")

def main():
    """Main launcher function"""
    print("=" * 50)
    print("🚁 DRONE BACKEND LAUNCHER")
    print("=" * 50)
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements. Exiting.")
        return
    
    print("\n🚀 Starting drone backend server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("🛑 To stop: Press Ctrl+C")
    print("=" * 50)
    
    # Start backend server
    start_backend_server()

if __name__ == "__main__":
    main()
