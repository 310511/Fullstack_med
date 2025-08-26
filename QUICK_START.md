# Quick Start Guide - Drone Navigation Simulation

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
pip install pygame==2.5.2
```

### 2. Run the Simulation
```bash
python drone_sim.py
```

### 3. Use the Controls
- **SPACE**: Start/stop drone movement
- **R**: Reset with new random obstacles
- **ESC**: Quit the simulation

## 🎮 What You'll See

- **Green Circle**: Start position (bottom-left)
- **Blue Circle**: Goal position (top-right)
- **Red Shapes**: Random obstacles (rectangles & circles)
- **Black Circle**: Drone
- **Yellow Lines**: Calculated optimal path
- **Gray Grid**: Navigation grid

## 🔧 Features

✅ **A* Pathfinding**: Intelligent obstacle avoidance  
✅ **Random Obstacles**: Different layouts each run  
✅ **Step-by-Step Movement**: Watch the drone navigate  
✅ **Visual Feedback**: Color-coded elements  
✅ **Interactive Controls**: Start, stop, reset  

## 🧪 Test the Algorithm

Run the component test to verify everything works:
```bash
python simple_test.py
```

## 📁 Files Created

- `drone_sim.py` - Main simulation
- `simple_test.py` - Component tests
- `requirements_drone.txt` - Dependencies
- `DRONE_SIMULATION_README.md` - Detailed documentation

## 🎯 How It Works

1. **Generate Obstacles**: Random red shapes block the path
2. **Calculate Path**: A* algorithm finds optimal route
3. **Navigate**: Drone follows yellow path to goal
4. **Reset**: Generate new obstacles and repeat

The simulation demonstrates efficient pathfinding with real-time visualization!
