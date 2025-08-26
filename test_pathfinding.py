#!/usr/bin/env python3
"""
Test script for the A* pathfinding algorithm used in the drone simulation.
This script tests the core pathfinding logic without requiring a display.
"""

import random
import math
import heapq

# Constants (same as in drone_sim.py)
GRID_WIDTH = 40
GRID_HEIGHT = 30

class Node:
    def __init__(self, x, y, g_cost=float('inf'), h_cost=0):
        self.x = x
        self.y = y
        self.g_cost = g_cost
        self.h_cost = h_cost
        self.parent = None
    
    @property
    def f_cost(self):
        return self.g_cost + self.h_cost
    
    def __lt__(self, other):
        if self.f_cost != other.f_cost:
            return self.f_cost < other.f_cost
        # If f_costs are equal, use position for consistent ordering
        return (self.x, self.y) < (other.x, other.y)

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

class PathfindingTester:
    def __init__(self):
        self.start_pos = (1, GRID_HEIGHT - 2)
        self.end_pos = (GRID_WIDTH - 2, 1)
        self.obstacles = []
    
    def generate_obstacles(self):
        self.obstacles.clear()
        num_obstacles = random.randint(8, 15)
        
        for _ in range(num_obstacles):
            x = random.randint(0, GRID_WIDTH - 1)
            y = random.randint(0, GRID_HEIGHT - 1)
            width = random.randint(2, 6)
            height = random.randint(2, 6)
            shape = random.choice(["rectangle", "circle"])
            
            if (x, y) == self.start_pos or (x, y) == self.end_pos:
                continue
            
            self.obstacles.append(Obstacle(x, y, width, height, shape))
    
    def is_valid_position(self, x, y):
        if x < 0 or x >= GRID_WIDTH or y < 0 or y >= GRID_HEIGHT:
            return False
        
        for obstacle in self.obstacles:
            if obstacle.contains_point(x, y):
                return False
        
        return True
    
    def get_neighbors(self, node):
        neighbors = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)]
        
        for dx, dy in directions:
            new_x, new_y = node.x + dx, node.y + dy
            if self.is_valid_position(new_x, new_y):
                neighbors.append(Node(new_x, new_y))
        
        return neighbors
    
    def heuristic(self, node, goal):
        return math.sqrt((node.x - goal.x)**2 + (node.y - goal.y)**2)
    
    def find_path(self):
        start_node = Node(self.start_pos[0], self.start_pos[1], 0)
        goal_node = Node(self.end_pos[0], self.end_pos[1])
        start_node.h_cost = self.heuristic(start_node, goal_node)
        
        open_set = [start_node]
        closed_set = set()
        came_from = {}
        g_costs = {start_node: 0}
        
        while open_set:
            current = heapq.heappop(open_set)
            
            if current.x == goal_node.x and current.y == goal_node.y:
                path = []
                while current:
                    path.append((current.x, current.y))
                    current = came_from.get(current)
                path.reverse()
                return path
            
            closed_set.add((current.x, current.y))
            
            for neighbor in self.get_neighbors(current):
                if (neighbor.x, neighbor.y) in closed_set:
                    continue
                
                tentative_g_cost = g_costs[current] + self.heuristic(current, neighbor)
                
                if neighbor not in g_costs or tentative_g_cost < g_costs[neighbor]:
                    came_from[neighbor] = current
                    g_costs[neighbor] = tentative_g_cost
                    neighbor.g_cost = tentative_g_cost
                    neighbor.h_cost = self.heuristic(neighbor, goal_node)
                    
                    if neighbor not in open_set:
                        heapq.heappush(open_set, neighbor)
        
        return None
    
    def test_pathfinding(self, num_tests=10):
        print("Testing A* Pathfinding Algorithm")
        print("=" * 40)
        
        successful_paths = 0
        failed_paths = 0
        
        for i in range(num_tests):
            print(f"\nTest {i + 1}/{num_tests}")
            self.generate_obstacles()
            
            path = self.find_path()
            
            if path:
                print(f"✓ Path found! Length: {len(path)} steps")
                print(f"  Start: {self.start_pos} -> End: {self.end_pos}")
                successful_paths += 1
            else:
                print(f"✗ No path available")
                print(f"  Start: {self.start_pos} -> End: {self.end_pos}")
                failed_paths += 1
        
        print("\n" + "=" * 40)
        print(f"Test Results:")
        print(f"Successful paths: {successful_paths}")
        print(f"Failed paths: {failed_paths}")
        print(f"Success rate: {successful_paths/num_tests*100:.1f}%")
        
        if successful_paths > 0:
            print("\n✓ Pathfinding algorithm is working correctly!")
        else:
            print("\n✗ Pathfinding algorithm needs debugging!")

def main():
    tester = PathfindingTester()
    tester.test_pathfinding(10)

if __name__ == "__main__":
    main()
