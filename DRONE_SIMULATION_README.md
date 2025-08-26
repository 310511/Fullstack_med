# 2D Drone Navigation Simulation

A Python-based 2D simulation of a black drone navigating from a fixed start position (bottom-left corner) to an end position (top-right corner) using A* pathfinding algorithm to avoid randomly generated obstacles.

## Features

- **A* Pathfinding Algorithm**: Efficient obstacle avoidance using heuristic-based search
- **Random Obstacle Generation**: Red rectangular and circular obstacles with random positions and sizes
- **Step-by-Step Visualization**: Real-time drone movement along the calculated path
- **Interactive Controls**: Start/stop simulation, reset with new obstacles
- **Visual Feedback**: Color-coded elements and status messages

## Color Scheme

- **Green Circle**: Start position (bottom-left corner)
- **Blue Circle**: End position (top-right corner)
- **Red Shapes**: Obstacles (rectangles and circles)
- **Black Circle**: Drone
- **Yellow Lines**: Calculated path
- **Gray Lines**: Grid

## Controls

- **SPACE**: Start/stop the simulation
- **R**: Reset simulation with new random obstacles
- **ESC**: Quit the application

## Installation

1. Install Python 3.7 or higher
2. Install required dependencies:
   ```bash
   pip install -r requirements_drone.txt
   ```

## Running the Simulation

```bash
python drone_sim.py
```

## How It Works

1. **Initialization**: The simulation generates random obstacles and calculates the optimal path using A* algorithm
2. **Pathfinding**: A* algorithm finds the shortest path from start to goal while avoiding obstacles
3. **Navigation**: The drone follows the calculated path step by step
4. **Obstacle Avoidance**: The algorithm ensures the drone never collides with obstacles
5. **Reset**: Generate new random obstacles and recalculate path

## Algorithm Details

### A* Pathfinding
- Uses a heuristic function (Euclidean distance) to estimate cost to goal
- Maintains open and closed sets for efficient exploration
- Finds optimal path while avoiding obstacles
- Supports 8-directional movement (including diagonals)

### Obstacle Detection
- Supports both rectangular and circular obstacles
- Collision detection for both shapes
- Prevents obstacles from blocking start/end positions

## Simulation States

- **No Path Available**: When obstacles completely block the path
- **Drone Navigating**: When drone is moving along the calculated path
- **Goal Reached**: When drone successfully reaches the destination

## Technical Specifications

- **Window Size**: 800x600 pixels
- **Grid Size**: 20x20 pixel cells
- **Grid Dimensions**: 40x30 cells
- **Obstacle Count**: 8-15 random obstacles per simulation
- **Obstacle Sizes**: 2-6 grid cells in width and height
- **Update Rate**: 60 FPS with 0.1 second delay between drone movements

## Requirements

- Python 3.7+
- Pygame 2.5.2
- Windows/Linux/macOS with display support

## Troubleshooting

- **Display Issues**: Ensure your system supports Pygame and has a display
- **Performance**: The simulation runs at 60 FPS, reduce if needed
- **Path Not Found**: Press 'R' to generate new obstacles and try again
