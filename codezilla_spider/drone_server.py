from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Serve static files from public directory
@app.route('/')
def index():
    return send_from_directory('public', 'drone_dashboard.html')

@app.route('/drone_dashboard.html')
def drone_dashboard():
    return send_from_directory('public', 'drone_dashboard.html')

@app.route('/api/status')
def status():
    return jsonify({
        'status': 'running',
        'message': 'Drone system is active',
        'backend_connected': True
    })

@app.route('/api/drones')
def drones():
    return jsonify({
        'drones': [
            {
                'id': 'DRONE-001',
                'name': 'VitalSync Drone Alpha',
                'status': 'active',
                'battery': 85,
                'position': {'x': 0, 'y': 0, 'z': 10}
            },
            {
                'id': 'DRONE-002',
                'name': 'VitalSync Drone Beta',
                'status': 'in_flight',
                'battery': 72,
                'position': {'x': 15, 'y': 5, 'z': 20}
            }
        ]
    })

if __name__ == '__main__':
    print("🚁 Starting Drone Server for Codezilla Spider...")
    print("📍 Server will be available at: http://localhost:5000")
    print("🚁 Dashboard will be available at: http://localhost:5000/drone_dashboard.html")
    app.run(host='0.0.0.0', port=5000, debug=True)
