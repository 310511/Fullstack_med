import pygame
import random
import math
import heapq
from typing import List, Tuple, Optional, Set
import time

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
GRID_SIZE = 20
GRID_WIDTH = WINDOW_WIDTH // GRID_SIZE
GRID_HEIGHT = WINDOW_HEIGHT // GRID_SIZE

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
GRAY = (128, 128, 128)
YELLOW = (255, 255, 0)
PURPLE = (128, 0, 128)

class Node:
    def __init__(self, x: int, y: int, g_cost: float = float('inf'), h_cost: float = 0):
        self.x = x
        self.y = y
        self.g_cost = g_cost  # Cost from start to current node
        self.h_cost = h_cost  # Heuristic cost from current node to goal
        self.parent = None
    
    @property
    def f_cost(self) -> float:
        return self.g_cost + self.h_cost
    
    def __lt__(self, other):
        return self.f_cost < other.f_cost
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    def __hash__(self):
        return hash((self.x, self.y))

class Obstacle:
    def __init__(self, x: int, y: int, width: int, height: int, shape: str = "rectangle"):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.shape = shape  # "rectangle" or "circle"
    
    def contains_point(self, point_x: int, point_y: int) -> bool:
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

class DroneSimulation:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Drone Navigation Simulation")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        
        # Start and end positions
        self.start_pos = (1, GRID_HEIGHT - 2)  # Bottom-left corner
        self.end_pos = (GRID_WIDTH - 2, 1)     # Top-right corner
        
        # Drone position
        self.drone_pos = list(self.start_pos)
        
        # Obstacles
        self.obstacles = []
        
        # Path
        self.path = []
        self.current_path_index = 0
        
        # Simulation state
        self.simulation_running = False
        self.path_found = False
        self.simulation_complete = False
        
        # Generate initial obstacles
        self.generate_obstacles()
        
        # Find initial path
        self.find_path()
    
    def generate_obstacles(self):
        """Generate random obstacles"""
        self.obstacles.clear()
        num_obstacles = random.randint(8, 15)
        
        for _ in range(num_obstacles):
            # Random position and size
            x = random.randint(0, GRID_WIDTH - 1)
            y = random.randint(0, GRID_HEIGHT - 1)
            width = random.randint(2, 6)
            height = random.randint(2, 6)
            shape = random.choice(["rectangle", "circle"])
            
            # Don't place obstacles on start or end positions
            if (x, y) == self.start_pos or (x, y) == self.end_pos:
                continue
            
            obstacle = Obstacle(x, y, width, height, shape)
            self.obstacles.append(obstacle)
    
    def is_valid_position(self, x: int, y: int) -> bool:
        """Check if a position is valid (within bounds and not occupied by obstacles)"""
        if x < 0 or x >= GRID_WIDTH or y < 0 or y >= GRID_HEIGHT:
            return False
        
        # Check if position is occupied by any obstacle
        for obstacle in self.obstacles:
            if obstacle.contains_point(x, y):
                return False
        
        return True
    
    def get_neighbors(self, node: Node) -> List[Node]:
        """Get valid neighboring nodes"""
        neighbors = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0),  # 4-directional
                     (1, 1), (1, -1), (-1, 1), (-1, -1)]  # 8-directional
        
        for dx, dy in directions:
            new_x, new_y = node.x + dx, node.y + dy
            if self.is_valid_position(new_x, new_y):
                neighbors.append(Node(new_x, new_y))
        
        return neighbors
    
    def heuristic(self, node: Node, goal: Node) -> float:
        """Calculate heuristic cost (Euclidean distance)"""
        return math.sqrt((node.x - goal.x)**2 + (node.y - goal.y)**2)
    
    def find_path(self):
        """Find path using A* algorithm"""
        start_node = Node(self.start_pos[0], self.start_pos[1], 0)
        goal_node = Node(self.end_pos[0], self.end_pos[1])
        
        # Calculate heuristic for start node
        start_node.h_cost = self.heuristic(start_node, goal_node)
        
        open_set = [start_node]
        closed_set = set()
        came_from = {}
        
        g_costs = {start_node: 0}
        
        while open_set:
            current = heapq.heappop(open_set)
            
            if current.x == goal_node.x and current.y == goal_node.y:
                # Path found, reconstruct it
                self.path = []
                while current:
                    self.path.append((current.x, current.y))
                    current = came_from.get(current)
                self.path.reverse()
                self.path_found = True
                self.current_path_index = 0
                return
            
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
        
        # No path found
        self.path_found = False
        self.path = []
    
    def reset_simulation(self):
        """Reset simulation with new obstacles"""
        self.drone_pos = list(self.start_pos)
        self.current_path_index = 0
        self.simulation_running = False
        self.simulation_complete = False
        self.generate_obstacles()
        self.find_path()
    
    def update_drone_position(self):
        """Update drone position along the path"""
        if not self.path_found or self.simulation_complete:
            return
        
        if self.current_path_index < len(self.path):
            target_pos = self.path[self.current_path_index]
            current_x, current_y = self.drone_pos
            
            # Move towards target position
            if current_x < target_pos[0]:
                current_x += 1
            elif current_x > target_pos[0]:
                current_x -= 1
            
            if current_y < target_pos[1]:
                current_y += 1
            elif current_y > target_pos[1]:
                current_y -= 1
            
            self.drone_pos = [current_x, current_y]
            
            # Check if reached target position
            if self.drone_pos == list(target_pos):
                self.current_path_index += 1
                
                # Check if reached goal
                if self.current_path_index >= len(self.path):
                    self.simulation_complete = True
    
    def draw(self):
        """Draw the simulation"""
        self.screen.fill(WHITE)
        
        # Draw grid
        for x in range(0, WINDOW_WIDTH, GRID_SIZE):
            pygame.draw.line(self.screen, GRAY, (x, 0), (x, WINDOW_HEIGHT))
        for y in range(0, WINDOW_HEIGHT, GRID_SIZE):
            pygame.draw.line(self.screen, GRAY, (0, y), (WINDOW_WIDTH, y))
        
        # Draw obstacles
        for obstacle in self.obstacles:
            x = obstacle.x * GRID_SIZE
            y = obstacle.y * GRID_SIZE
            width = obstacle.width * GRID_SIZE
            height = obstacle.height * GRID_SIZE
            
            if obstacle.shape == "rectangle":
                pygame.draw.rect(self.screen, RED, (x, y, width, height))
            elif obstacle.shape == "circle":
                center_x = x + width // 2
                center_y = y + height // 2
                radius = min(width, height) // 2
                pygame.draw.circle(self.screen, RED, (center_x, center_y), radius)
        
        # Draw start position (green)
        start_x = self.start_pos[0] * GRID_SIZE + GRID_SIZE // 2
        start_y = self.start_pos[1] * GRID_SIZE + GRID_SIZE // 2
        pygame.draw.circle(self.screen, GREEN, (start_x, start_y), GRID_SIZE // 3)
        
        # Draw end position (blue)
        end_x = self.end_pos[0] * GRID_SIZE + GRID_SIZE // 2
        end_y = self.end_pos[1] * GRID_SIZE + GRID_SIZE // 2
        pygame.draw.circle(self.screen, BLUE, (end_x, end_y), GRID_SIZE // 3)
        
        # Draw path
        if self.path_found:
            for i in range(len(self.path) - 1):
                x1 = self.path[i][0] * GRID_SIZE + GRID_SIZE // 2
                y1 = self.path[i][1] * GRID_SIZE + GRID_SIZE // 2
                x2 = self.path[i + 1][0] * GRID_SIZE + GRID_SIZE // 2
                y2 = self.path[i + 1][1] * GRID_SIZE + GRID_SIZE // 2
                pygame.draw.line(self.screen, YELLOW, (x1, y1), (x2, y2), 3)
        
        # Draw drone (black)
        drone_x = self.drone_pos[0] * GRID_SIZE + GRID_SIZE // 2
        drone_y = self.drone_pos[1] * GRID_SIZE + GRID_SIZE // 2
        pygame.draw.circle(self.screen, BLACK, (drone_x, drone_y), GRID_SIZE // 4)
        
        # Draw status text
        if not self.path_found:
            text = self.font.render("No path available!", True, RED)
            text_rect = text.get_rect(center=(WINDOW_WIDTH // 2, 30))
            self.screen.blit(text, text_rect)
        elif self.simulation_complete:
            text = self.font.render("Goal reached!", True, GREEN)
            text_rect = text.get_rect(center=(WINDOW_WIDTH // 2, 30))
            self.screen.blit(text, text_rect)
        else:
            text = self.font.render("Drone navigating...", True, BLACK)
            text_rect = text.get_rect(center=(WINDOW_WIDTH // 2, 30))
            self.screen.blit(text, text_rect)
        
        # Draw instructions
        instructions = [
            "Press SPACE to start/stop simulation",
            "Press R to reset with new obstacles",
            "Press ESC to quit"
        ]
        
        for i, instruction in enumerate(instructions):
            text = pygame.font.Font(None, 24).render(instruction, True, BLACK)
            self.screen.blit(text, (10, WINDOW_HEIGHT - 80 + i * 25))
        
        pygame.display.flip()
    
    def run(self):
        """Main simulation loop"""
        running = True
        
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        running = False
                    elif event.key == pygame.K_SPACE:
                        if self.path_found:
                            self.simulation_running = not self.simulation_running
                    elif event.key == pygame.K_r:
                        self.reset_simulation()
            
            # Update drone position if simulation is running
            if self.simulation_running and self.path_found and not self.simulation_complete:
                self.update_drone_position()
                time.sleep(0.1)  # Slow down the simulation
            
            self.draw()
            self.clock.tick(60)
        
        pygame.quit()

if __name__ == "__main__":
    simulation = DroneSimulation()
    simulation.run()
