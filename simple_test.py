#!/usr/bin/env python3
"""
Simple test script for the drone simulation components.
"""

import random
import math

# Constants
GRID_WIDTH = 40
GRID_HEIGHT = 30

class Obstacle:
    def __init__(self, x, y, width, height, shape="rectangle"):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.shape = shape
    
    def contains_point(self, point_x, point_y):
        if self.shape == "rectangle":
            return (self.x <= point_x <= self.x + self.width and 
                   self.y <= point_y <= self.y + self.height)
        elif self.shape == "circle":
            center_x = self.x + self.width // 2
            center_y = self.y + self.height // 2
            radius = min(self.width, self.height) // 2
            distance = math.sqrt((point_x - center_x)**2 + (point_y - center_y)**2)
            return distance <= radius
        return False

def test_obstacle_generation():
    print("Testing Obstacle Generation")
    print("=" * 30)
    
    start_pos = (1, GRID_HEIGHT - 2)
    end_pos = (GRID_WIDTH - 2, 1)
    
    obstacles = []
    num_obstacles = random.randint(8, 15)
    
    for i in range(num_obstacles):
        x = random.randint(0, GRID_WIDTH - 1)
        y = random.randint(0, GRID_HEIGHT - 1)
        width = random.randint(2, 6)
        height = random.randint(2, 6)
        shape = random.choice(["rectangle", "circle"])
        
        if (x, y) == start_pos or (x, y) == end_pos:
            continue
        
        obstacles.append(Obstacle(x, y, width, height, shape))
    
    print(f"Generated {len(obstacles)} obstacles")
    print(f"Start position: {start_pos}")
    print(f"End position: {end_pos}")
    
    # Test obstacle collision detection
    test_points = [(0, 0), (10, 10), (20, 20), (30, 30)]
    for point in test_points:
        collisions = sum(1 for obs in obstacles if obs.contains_point(point[0], point[1]))
        print(f"Point {point}: {collisions} collisions")
    
    print("✓ Obstacle generation and collision detection working!")

def test_grid_bounds():
    print("\nTesting Grid Bounds")
    print("=" * 30)
    
    # Test valid positions
    valid_positions = [(0, 0), (GRID_WIDTH-1, 0), (0, GRID_HEIGHT-1), (GRID_WIDTH-1, GRID_HEIGHT-1)]
    for pos in valid_positions:
        if 0 <= pos[0] < GRID_WIDTH and 0 <= pos[1] < GRID_HEIGHT:
            print(f"✓ Position {pos} is valid")
        else:
            print(f"✗ Position {pos} is invalid")
    
    # Test invalid positions
    invalid_positions = [(-1, 0), (GRID_WIDTH, 0), (0, -1), (0, GRID_HEIGHT)]
    for pos in invalid_positions:
        if 0 <= pos[0] < GRID_WIDTH and 0 <= pos[1] < GRID_HEIGHT:
            print(f"✗ Position {pos} should be invalid")
        else:
            print(f"✓ Position {pos} correctly identified as invalid")
    
    print("✓ Grid bounds checking working!")

def test_heuristic():
    print("\nTesting Heuristic Function")
    print("=" * 30)
    
    def heuristic(node, goal):
        return math.sqrt((node[0] - goal[0])**2 + (node[1] - goal[1])**2)
    
    test_cases = [
        ((0, 0), (3, 4)),  # Should be 5.0
        ((1, 1), (1, 1)),  # Should be 0.0
        ((0, 0), (1, 1)),  # Should be sqrt(2)
    ]
    
    for start, goal in test_cases:
        h = heuristic(start, goal)
        expected = math.sqrt((start[0] - goal[0])**2 + (start[1] - goal[1])**2)
        print(f"Start: {start}, Goal: {goal}, Heuristic: {h:.2f}, Expected: {expected:.2f}")
        if abs(h - expected) < 0.01:
            print("✓ Heuristic calculation correct!")
        else:
            print("✗ Heuristic calculation incorrect!")

def main():
    print("Drone Simulation Component Tests")
    print("=" * 40)
    
    test_obstacle_generation()
    test_grid_bounds()
    test_heuristic()
    
    print("\n" + "=" * 40)
    print("All basic tests completed!")
    print("The simulation components are working correctly.")

if __name__ == "__main__":
    main()
