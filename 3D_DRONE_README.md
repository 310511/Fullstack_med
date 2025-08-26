# 3D Drone Visualization & Control

A modern 3D drone simulation built with Three.js featuring interactive controls and real-time visualization.

## 🚁 Features

### **3D Visualization**
- **Realistic Drone Model**: Detailed quadcopter with body, arms, propellers, camera, and LED indicators
- **Dynamic Environment**: Green ground plane with grid, sky background, and random obstacles
- **Real-time Animation**: Spinning propellers and smooth movement
- **Lighting & Shadows**: Professional lighting with shadow mapping

### **Interactive Controls**
- **Slider Controls**: Precise control over altitude, forward/backward, lateral movement, and rotation
- **Keyboard Controls**: WASD for movement, Space/Shift for altitude, Q/E for rotation
- **Auto Fly Mode**: Automatic flight patterns with smooth animations
- **Reset Function**: Return drone to starting position

### **Status Monitoring**
- **Real-time Position**: Live coordinates display
- **Battery Level**: Decreasing battery simulation
- **Flight Mode**: Manual/Auto Fly status
- **Visual Feedback**: LED indicators on drone

## 🎮 How to Use

### **Opening the Simulation**
1. Open `drone_3d_simple.html` in any modern web browser
2. The 3D scene will load automatically
3. Use the controls panel on the left to manipulate the drone

### **Control Methods**

#### **Slider Controls**
- **Altitude**: 0-50 units (Z-axis movement)
- **Forward**: -20 to +20 units (Y-axis movement)
- **Lateral**: -20 to +20 units (X-axis movement)
- **Rotation**: -180° to +180° (Yaw rotation)

#### **Keyboard Controls**
- **W/S**: Move forward/backward
- **A/D**: Move left/right
- **Space**: Increase altitude
- **Shift**: Decrease altitude
- **Q/E**: Rotate left/right

#### **Buttons**
- **Reset**: Return drone to starting position (0, 0, 10)
- **Auto Fly**: Toggle automatic flight mode with smooth patterns

## 🎯 Technical Details

### **3D Scene Components**
- **Drone**: Group of meshes including body, arms, propellers, camera, and LEDs
- **Environment**: Ground plane, grid helper, sky background
- **Obstacles**: Random red boxes and cylinders scattered around
- **Lighting**: Ambient and directional lights with shadows

### **Animation System**
- **Propeller Animation**: Continuous rotation of all 4 propellers
- **Battery Drain**: Gradual decrease in battery percentage
- **Auto Fly**: Smooth sinusoidal movement patterns
- **Real-time Updates**: 60 FPS rendering with smooth transitions

### **Browser Compatibility**
- **WebGL Support**: Requires WebGL-capable browser
- **Three.js**: Uses CDN version for easy deployment
- **Responsive**: Adapts to window resizing
- **Cross-platform**: Works on Windows, Mac, Linux, mobile

## 🔧 Customization

### **Modifying Drone Appearance**
```javascript
// Change drone body color
const bodyMaterial = new THREE.MeshLambertMaterial({color: 0x333333});

// Adjust propeller size
const propellerGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1);
```

### **Adding New Controls**
```javascript
// Add new slider control
document.getElementById('new-control').addEventListener('input', updateDrone);
```

### **Custom Flight Patterns**
```javascript
// Modify auto fly behavior
const alt = 15 + Math.sin(time * 0.5) * 5;
const fwd = Math.sin(time * 0.3) * 10;
```

## 📁 File Structure

```
shine2/
├── drone_3d_simple.html     # Main 3D drone visualization
├── drone_sim.py            # 2D Python simulation
├── 3D_DRONE_README.md      # This documentation
└── requirements_drone.txt   # Python dependencies
```

## 🚀 Quick Start

1. **Open the file**: Double-click `drone_3d_simple.html` or open in browser
2. **Wait for loading**: "Loading 3D Scene..." will disappear when ready
3. **Start controlling**: Use sliders or keyboard to move the drone
4. **Try auto fly**: Click "Auto Fly" for automatic movement
5. **Reset when needed**: Click "Reset" to return to starting position

## 🎨 Visual Elements

- **Black Drone**: Main quadcopter body with gray arms
- **Green LEDs**: Status indicators on the drone
- **Red Obstacles**: Random boxes and cylinders in the environment
- **Green Ground**: Base plane with grid lines
- **Blue Sky**: Background environment
- **Spinning Propellers**: Animated black propellers

## 🔍 Troubleshooting

### **Scene Not Loading**
- Ensure WebGL is enabled in your browser
- Check browser console for errors
- Try refreshing the page

### **Controls Not Responding**
- Make sure the page is fully loaded
- Check if JavaScript is enabled
- Try clicking on the 3D scene first

### **Performance Issues**
- Close other browser tabs
- Reduce browser window size
- Update graphics drivers

## 🌟 Future Enhancements

- **Camera Controls**: Mouse/touch camera manipulation
- **Collision Detection**: Obstacle avoidance system
- **Multiple Drones**: Multi-drone simulation
- **Physics Engine**: Realistic flight physics
- **VR Support**: Virtual reality compatibility
- **Network Control**: Remote drone control via network

The 3D drone visualization provides an immersive experience for understanding drone movement and control systems!
