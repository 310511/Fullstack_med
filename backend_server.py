from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time
import random
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables for drone fleet management
drone_fleet = {
    'drones': [
        {
            'id': 'DRONE-001',
            'name': 'Alpha',
            'status': 'active',
            'position': {'x': 0, 'y': 0, 'z': 10},
            'battery': 85,
            'mission': 'patrol',
            'last_update': datetime.now().isoformat()
        },
        {
            'id': 'DRONE-002', 
            'name': 'Beta',
            'status': 'in_flight',
            'position': {'x': 15, 'y': 5, 'z': 20},
            'battery': 72,
            'mission': 'delivery',
            'last_update': datetime.now().isoformat()
        },
        {
            'id': 'DRONE-003',
            'name': 'Gamma',
            'status': 'maintenance',
            'position': {'x': 0, 'y': 0, 'z': 0},
            'battery': 45,
            'mission': 'idle',
            'last_update': datetime.now().isoformat()
        }
    ],
    'missions': [
        {
            'id': 'MISSION-001',
            'type': 'patrol',
            'status': 'active',
            'drone_id': 'DRONE-001',
            'start_time': datetime.now().isoformat(),
            'waypoints': [
                {'x': 0, 'y': 0, 'z': 10},
                {'x': 20, 'y': 0, 'z': 15},
                {'x': 20, 'y': 20, 'z': 20},
                {'x': 0, 'y': 20, 'z': 15}
            ]
        },
        {
            'id': 'MISSION-002',
            'type': 'delivery',
            'status': 'in_progress',
            'drone_id': 'DRONE-002',
            'start_time': datetime.now().isoformat(),
            'destination': {'x': 30, 'y': 30, 'z': 25}
        }
    ],
    'system_status': {
        'backend_connected': True,
        'weather': 'optimal',
        'air_traffic': 'clear',
        'wind_speed': 8,
        'temperature': 22,
        'emergency_mode': False
    }
}

# Statistics tracking
stats = {
    'total_missions': 156,
    'completed_missions': 152,
    'success_rate': 97.4,
    'total_flight_time': 2847,  # hours
    'active_drones': 2,
    'in_flight': 1
}

@app.route('/')
def home():
    return jsonify({
        'message': 'Drone Management Backend Server',
        'status': 'running',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/status')
def get_status():
    """Get overall system status"""
    return jsonify({
        'system_status': drone_fleet['system_status'],
        'stats': stats,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/drones')
def get_drones():
    """Get all drones status"""
    return jsonify({
        'drones': drone_fleet['drones'],
        'count': len(drone_fleet['drones']),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/drones/<drone_id>')
def get_drone(drone_id):
    """Get specific drone status"""
    drone = next((d for d in drone_fleet['drones'] if d['id'] == drone_id), None)
    if drone:
        return jsonify(drone)
    return jsonify({'error': 'Drone not found'}), 404

@app.route('/api/drones/<drone_id>/control', methods=['POST'])
def control_drone(drone_id):
    """Control specific drone"""
    data = request.get_json()
    drone = next((d for d in drone_fleet['drones'] if d['id'] == drone_id), None)
    
    if not drone:
        return jsonify({'error': 'Drone not found'}), 404
    
    # Update drone position based on control commands
    if 'position' in data:
        drone['position'] = data['position']
    if 'status' in data:
        drone['status'] = data['status']
    
    drone['last_update'] = datetime.now().isoformat()
    
    return jsonify({
        'message': f'Drone {drone_id} controlled successfully',
        'drone': drone
    })

@app.route('/api/missions')
def get_missions():
    """Get all missions"""
    return jsonify({
        'missions': drone_fleet['missions'],
        'count': len(drone_fleet['missions']),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/missions', methods=['POST'])
def create_mission():
    """Create new mission"""
    data = request.get_json()
    
    new_mission = {
        'id': f'MISSION-{len(drone_fleet["missions"]) + 1:03d}',
        'type': data.get('type', 'patrol'),
        'status': 'pending',
        'drone_id': data.get('drone_id'),
        'start_time': datetime.now().isoformat(),
        'waypoints': data.get('waypoints', []),
        'destination': data.get('destination')
    }
    
    drone_fleet['missions'].append(new_mission)
    stats['total_missions'] += 1
    
    return jsonify({
        'message': 'Mission created successfully',
        'mission': new_mission
    })

@app.route('/api/emergency/stop', methods=['POST'])
def emergency_stop():
    """Emergency stop all drones"""
    drone_fleet['system_status']['emergency_mode'] = True
    
    # Stop all drones
    for drone in drone_fleet['drones']:
        drone['status'] = 'emergency_stop'
        drone['position'] = {'x': 0, 'y': 0, 'z': 0}
    
    return jsonify({
        'message': 'Emergency stop activated',
        'status': 'emergency_mode',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/emergency/reset', methods=['POST'])
def emergency_reset():
    """Reset emergency mode"""
    drone_fleet['system_status']['emergency_mode'] = False
    
    # Reset drones to idle
    for drone in drone_fleet['drones']:
        if drone['status'] == 'emergency_stop':
            drone['status'] = 'idle'
    
    return jsonify({
        'message': 'Emergency mode reset',
        'status': 'normal',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/weather')
def get_weather():
    """Get current weather conditions"""
    return jsonify({
        'weather': drone_fleet['system_status']['weather'],
        'air_traffic': drone_fleet['system_status']['air_traffic'],
        'wind_speed': drone_fleet['system_status']['wind_speed'],
        'temperature': drone_fleet['system_status']['temperature'],
        'timestamp': datetime.now().isoformat()
    })

def update_drone_positions():
    """Background task to update drone positions"""
    while True:
        try:
            for drone in drone_fleet['drones']:
                if drone['status'] == 'in_flight':
                    # Simulate movement
                    drone['position']['x'] += random.uniform(-2, 2)
                    drone['position']['y'] += random.uniform(-2, 2)
                    drone['position']['z'] += random.uniform(-1, 1)
                    
                    # Keep within bounds
                    drone['position']['x'] = max(-50, min(50, drone['position']['x']))
                    drone['position']['y'] = max(-50, min(50, drone['position']['y']))
                    drone['position']['z'] = max(5, min(50, drone['position']['z']))
                    
                    # Decrease battery
                    drone['battery'] = max(0, drone['battery'] - random.uniform(0.1, 0.5))
                    
                    # Update timestamp
                    drone['last_update'] = datetime.now().isoformat()
                    
                    # If battery low, return to base
                    if drone['battery'] < 20:
                        drone['status'] = 'returning'
                        drone['position'] = {'x': 0, 'y': 0, 'z': 10}
            
            # Update stats
            stats['active_drones'] = len([d for d in drone_fleet['drones'] if d['status'] in ['active', 'in_flight']])
            stats['in_flight'] = len([d for d in drone_fleet['drones'] if d['status'] == 'in_flight'])
            
            time.sleep(2)  # Update every 2 seconds
            
        except Exception as e:
            print(f"Error in drone position update: {e}")
            time.sleep(5)

def start_background_tasks():
    """Start background tasks"""
    position_thread = threading.Thread(target=update_drone_positions, daemon=True)
    position_thread.start()
    print("Background tasks started")

if __name__ == '__main__':
    print("🚁 Starting Drone Management Backend Server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("📊 API endpoints:")
    print("   - GET  /api/status - System status")
    print("   - GET  /api/drones - All drones")
    print("   - GET  /api/missions - All missions")
    print("   - POST /api/emergency/stop - Emergency stop")
    print("   - POST /api/emergency/reset - Reset emergency")
    
    # Start background tasks
    start_background_tasks()
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
