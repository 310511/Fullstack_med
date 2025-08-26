#!/usr/bin/env python3
"""
Test script for drone integration in Codezilla Spider
Verifies that the backend is working and the frontend can connect
"""

import requests
import json
import time

def test_backend_connection():
    """Test if the backend server is running and responding"""
    print("🔍 Testing backend connection...")
    
    try:
        response = requests.get("http://localhost:5000/api/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend is running and responding")
            print(f"📊 System Status: {data.get('system_status', {}).get('backend_connected', 'Unknown')}")
            return True
        else:
            print(f"❌ Backend responded with status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running or not accessible")
        print("💡 Start the backend with: python start_drone_backend.py")
        return False
    except Exception as e:
        print(f"❌ Error testing backend: {e}")
        return False

def test_drones_endpoint():
    """Test the drones endpoint"""
    print("\n🚁 Testing drones endpoint...")
    
    try:
        response = requests.get("http://localhost:5000/api/drones", timeout=5)
        if response.status_code == 200:
            data = response.json()
            drones = data.get('drones', [])
            print(f"✅ Found {len(drones)} drones")
            for drone in drones:
                print(f"   - {drone.get('name', 'Unknown')} ({drone.get('status', 'Unknown')})")
            return True
        else:
            print(f"❌ Drones endpoint responded with status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing drones endpoint: {e}")
        return False

def test_missions_endpoint():
    """Test the missions endpoint"""
    print("\n📋 Testing missions endpoint...")
    
    try:
        response = requests.get("http://localhost:5000/api/missions", timeout=5)
        if response.status_code == 200:
            data = response.json()
            missions = data.get('missions', [])
            print(f"✅ Found {len(missions)} missions")
            for mission in missions:
                print(f"   - {mission.get('type', 'Unknown')} mission ({mission.get('status', 'Unknown')})")
            return True
        else:
            print(f"❌ Missions endpoint responded with status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing missions endpoint: {e}")
        return False

def test_emergency_endpoint():
    """Test the emergency endpoint"""
    print("\n🚨 Testing emergency endpoint...")
    
    try:
        response = requests.post("http://localhost:5000/api/emergency/stop", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Emergency stop endpoint working")
            print(f"📊 Response: {data.get('message', 'Unknown')}")
            
            # Reset emergency mode
            reset_response = requests.post("http://localhost:5000/api/emergency/reset", timeout=5)
            if reset_response.status_code == 200:
                print("✅ Emergency reset endpoint working")
            else:
                print("❌ Emergency reset endpoint failed")
            
            return True
        else:
            print(f"❌ Emergency endpoint responded with status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing emergency endpoint: {e}")
        return False

def main():
    """Main test function"""
    print("=" * 50)
    print("🚁 DRONE INTEGRATION TEST")
    print("=" * 50)
    
    # Test backend connection
    if not test_backend_connection():
        print("\n❌ Backend tests failed. Please start the backend first.")
        return
    
    # Test individual endpoints
    tests = [
        test_drones_endpoint,
        test_missions_endpoint,
        test_emergency_endpoint
    ]
    
    passed_tests = 0
    total_tests = len(tests)
    
    for test in tests:
        if test():
            passed_tests += 1
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS")
    print("=" * 50)
    print(f"✅ Passed: {passed_tests}/{total_tests} tests")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed! Drone integration is working correctly.")
        print("\n🚀 Next steps:")
        print("1. Start the React app: npm run dev")
        print("2. Navigate to the drone delivery section")
        print("3. Click 'Launch 3D Visualization'")
        print("4. Enjoy your enhanced drone delivery system!")
    else:
        print("❌ Some tests failed. Please check the backend configuration.")
    
    print("=" * 50)

if __name__ == "__main__":
    main()
