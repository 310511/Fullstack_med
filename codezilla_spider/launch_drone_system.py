#!/usr/bin/env python3
"""
Simple Drone System Launcher for Codezilla Spider
"""

import subprocess
import sys
import time
import webbrowser
import os

def main():
    print("🚁 Starting Drone System for Codezilla Spider...")
    print("=" * 50)
    
    # Start the backend server
    print("1. Starting backend server...")
    try:
        # Start backend in a subprocess
        backend_process = subprocess.Popen([
            sys.executable, 
            "backend_server.py"
        ])
        
        print("✅ Backend server started")
        print("📍 Backend URL: http://localhost:5000")
        
        # Wait a moment for server to start
        time.sleep(3)
        
        # Open the drone dashboard
        print("\n2. Opening drone dashboard...")
        dashboard_url = "http://localhost:5000/drone_dashboard.html"
        webbrowser.open(dashboard_url)
        print("✅ Drone dashboard opened in browser")
        
        print("\n🎉 Drone system is ready!")
        print("=" * 50)
        print("📊 Backend: http://localhost:5000")
        print("🚁 Dashboard: http://localhost:5000/drone_dashboard.html")
        print("🛑 To stop: Press Ctrl+C")
        print("=" * 50)
        
        # Keep the script running
        try:
            backend_process.wait()
        except KeyboardInterrupt:
            print("\n🛑 Shutting down drone system...")
            backend_process.terminate()
            print("✅ Drone system stopped")
            
    except Exception as e:
        print(f"❌ Error starting drone system: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()
