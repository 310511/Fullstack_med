import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plane, 
  Package, 
  MapPin, 
  Clock, 
  Battery, 
  Signal, 
  Wind, 
  Thermometer,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Eye,
  Route,
  Target,
  Zap,
  Shield,
  Box
} from 'lucide-react';

interface DroneDeliveryProps {
  className?: string;
}

interface Delivery {
  id: string;
  packageId: string;
  destination: string;
  status: 'pending' | 'in-flight' | 'delivered' | 'returning';
  droneId: string;
  estimatedTime: string;
  distance: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: string[];
  coordinates: { lat: number; lng: number };
}

interface Drone {
  id: string;
  name: string;
  status: 'available' | 'in-flight' | 'charging' | 'maintenance';
  battery: number;
  signal: number;
  location: { lat: number; lng: number };
  altitude: number;
  speed: number;
  temperature: number;
  windSpeed: number;
}

export const DroneDelivery: React.FC<DroneDeliveryProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [show3DVisualization, setShow3DVisualization] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    const sampleDrones: Drone[] = [
      {
        id: 'drone-001',
        name: 'VitalSync Drone Alpha',
        status: 'in-flight',
        battery: 85,
        signal: 92,
        location: { lat: 40.7128, lng: -74.0060 },
        altitude: 120,
        speed: 45,
        temperature: 22,
        windSpeed: 8
      },
      {
        id: 'drone-002',
        name: 'VitalSync Drone Beta',
        status: 'available',
        battery: 95,
        signal: 98,
        location: { lat: 40.7589, lng: -73.9851 },
        altitude: 0,
        speed: 0,
        temperature: 24,
        windSpeed: 5
      },
      {
        id: 'drone-003',
        name: 'VitalSync Drone Gamma',
        status: 'charging',
        battery: 45,
        signal: 100,
        location: { lat: 40.7505, lng: -73.9934 },
        altitude: 0,
        speed: 0,
        temperature: 23,
        windSpeed: 3
      }
    ];

    const sampleDeliveries: Delivery[] = [
      {
        id: 'delivery-001',
        packageId: 'PKG-2024-001',
        destination: 'City General Hospital',
        status: 'in-flight',
        droneId: 'drone-001',
        estimatedTime: '15 min',
        distance: '2.3 km',
        priority: 'urgent',
        items: ['Emergency Medicine', 'Blood Samples', 'Medical Supplies'],
        coordinates: { lat: 40.7589, lng: -73.9851 }
      },
      {
        id: 'delivery-002',
        packageId: 'PKG-2024-002',
        destination: 'Regional Medical Center',
        status: 'pending',
        droneId: 'drone-002',
        estimatedTime: '25 min',
        distance: '4.1 km',
        priority: 'high',
        items: ['Vaccines', 'Lab Equipment', 'Personal Protective Equipment'],
        coordinates: { lat: 40.7505, lng: -73.9934 }
      },
      {
        id: 'delivery-003',
        packageId: 'PKG-2024-003',
        destination: 'Community Health Clinic',
        status: 'delivered',
        droneId: 'drone-003',
        estimatedTime: '0 min',
        distance: '1.8 km',
        priority: 'medium',
        items: ['Prescription Medications', 'First Aid Supplies'],
        coordinates: { lat: 40.7128, lng: -74.0060 }
      }
    ];

    setDrones(sampleDrones);
    setDeliveries(sampleDeliveries);
  }, []);

  // Connect to backend
  useEffect(() => {
    const connectToBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/status');
        if (response.ok) {
          setBackendConnected(true);
          console.log('Connected to drone backend');
        }
      } catch (error) {
        console.log('Backend not available, using local simulation');
      }
    };
    connectToBackend();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-flight': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'returning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const [is3DModelActive, setIs3DModelActive] = useState(false);

  const launch3DVisualization = () => {
    setShow3DVisualization(true);
  };

  const close3DVisualization = () => {
    setShow3DVisualization(false);
  };

  const startSimulation = () => {
    setIsSimulationActive(true);
    setIs3DModelActive(true);
    
    // Clear any existing interval
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    
    // Start new simulation interval
    const interval = setInterval(() => {
      setDrones(prev => prev.map(drone => ({
        ...drone,
        battery: Math.max(0, drone.battery - Math.random() * 2),
        altitude: drone.status === 'in-flight' ? Math.max(0, drone.altitude + (Math.random() - 0.5) * 10) : drone.altitude,
        speed: drone.status === 'in-flight' ? Math.max(0, drone.speed + (Math.random() - 0.5) * 5) : drone.speed,
        temperature: drone.temperature + (Math.random() - 0.5) * 2,
        windSpeed: Math.max(0, drone.windSpeed + (Math.random() - 0.5) * 3)
      })));
      
      // Update deliveries with real-time changes
      setDeliveries(prev => prev.map(delivery => {
        if (delivery.status === 'in-flight') {
          const currentTime = parseInt(delivery.estimatedTime.split(' ')[0]);
          if (currentTime > 0) {
            return {
              ...delivery,
              estimatedTime: `${Math.max(0, currentTime - 1)} min`
            };
          } else {
            return {
              ...delivery,
              status: 'delivered' as const,
              estimatedTime: '0 min'
            };
          }
        }
        return delivery;
      }));
    }, 2000); // Update every 2 seconds
    
    setSimulationInterval(interval);
  };

  const stopSimulation = () => {
    setIsSimulationActive(false);
    setIs3DModelActive(false);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setIs3DModelActive(false);
    // Reset to initial data
    const sampleDrones: Drone[] = [
      {
        id: 'drone-001',
        name: 'VitalSync Drone Alpha',
        status: 'in-flight',
        battery: 85,
        signal: 92,
        location: { lat: 40.7128, lng: -74.0060 },
        altitude: 120,
        speed: 45,
        temperature: 22,
        windSpeed: 8
      },
      {
        id: 'drone-002',
        name: 'VitalSync Drone Beta',
        status: 'available',
        battery: 95,
        signal: 98,
        location: { lat: 40.7589, lng: -73.9851 },
        altitude: 0,
        speed: 0,
        temperature: 24,
        windSpeed: 5
      },
      {
        id: 'drone-003',
        name: 'VitalSync Drone Gamma',
        status: 'charging',
        battery: 45,
        signal: 100,
        location: { lat: 40.7505, lng: -73.9934 },
        altitude: 0,
        speed: 0,
        temperature: 23,
        windSpeed: 3
      }
    ];

    const sampleDeliveries: Delivery[] = [
      {
        id: 'delivery-001',
        packageId: 'PKG-2024-001',
        destination: 'City General Hospital',
        status: 'in-flight',
        droneId: 'drone-001',
        estimatedTime: '15 min',
        distance: '2.3 km',
        priority: 'urgent',
        items: ['Emergency Medicine', 'Blood Samples', 'Medical Supplies'],
        coordinates: { lat: 40.7589, lng: -73.9851 }
      },
      {
        id: 'delivery-002',
        packageId: 'PKG-2024-002',
        destination: 'Regional Medical Center',
        status: 'pending',
        droneId: 'drone-002',
        estimatedTime: '25 min',
        distance: '4.1 km',
        priority: 'high',
        items: ['Vaccines', 'Lab Equipment', 'Personal Protective Equipment'],
        coordinates: { lat: 40.7505, lng: -73.9934 }
      },
      {
        id: 'delivery-003',
        packageId: 'PKG-2024-003',
        destination: 'Community Health Clinic',
        status: 'delivered',
        droneId: 'drone-003',
        estimatedTime: '0 min',
        distance: '1.8 km',
        priority: 'medium',
        items: ['Prescription Medications', 'First Aid Supplies'],
        coordinates: { lat: 40.7128, lng: -74.0060 }
      }
    ];

    setDrones(sampleDrones);
    setDeliveries(sampleDeliveries);
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Drone Delivery System
        </h1>
        <p className="text-muted-foreground">AI-powered medical supply delivery with real-time tracking and monitoring</p>
        <div className="mt-4">
          <Button
            onClick={launch3DVisualization}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Box className="w-4 h-4 mr-2" />
            Launch 3D Visualization
          </Button>
        </div>
      </div>

      {/* 3D Visualization Modal */}
      {show3DVisualization && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-11/12 h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">🚁 3D Drone Visualization</h2>
              <Button onClick={close3DVisualization} variant="outline">
                ✕ Close
              </Button>
            </div>
            <div className="flex-1 p-4">
                             <iframe
                 src="/drone_dashboard_advanced.html"
                 className="w-full h-full border-0 rounded"
                 title="Advanced 3D Drone Visualization"
                 allowFullScreen
               />
            </div>
          </div>
        </div>
      )}

             {/* 3D Drone Model with Controls */}
       <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Plane className="h-5 w-5" />
             3D Drone Visualization & Controls
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex gap-6">
             {/* 3D Model - Half Width */}
             <div className="w-1/2">
               <div className="vitalsync-3d-viewer" style={{ height: '400px', width: '100%', position: 'relative' }}>
                                   <iframe 
                    title="VitalSync Drone 3D Model" 
                    frameBorder="0" 
                    allowFullScreen 
                    mozallowfullscreen="true" 
                    webkitallowfullscreen="true" 
                    allow="autoplay; fullscreen; xr-spatial-tracking" 
                    xr-spatial-tracking 
                    execution-while-out-of-viewport 
                    execution-while-not-rendered 
                    web-share 
                    src={`https://sketchfab.com/models/4938cf2701274e1bb2e2786c1e42459d/embed?autostart=${is3DModelActive ? 1 : 0}&autospin=${is3DModelActive ? 1 : 0}&preload=1`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      border: 'none', 
                      borderRadius: '12px',
                      filter: is3DModelActive ? 'none' : 'grayscale(50%) brightness(0.8)',
                      transition: 'filter 0.5s ease-in-out'
                    }}
                  />
                                   <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-black/95 to-black/85 backdrop-blur-md rounded-t-xl px-4 py-3 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold text-sm">VitalSync 3D Viewer</span>
                      </div>
                                             <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${is3DModelActive ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`}></div>
                         <span className="text-white/80 text-xs">{is3DModelActive ? 'Live Model' : 'Model Paused'}</span>
                       </div>
                    </div>
                  </div>
                  
                                     {/* Bottom overlay to hide Sketchfab logo and timeline */}
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/70 backdrop-blur-md rounded-b-xl px-4 py-4 border-t border-white/10" style={{ height: '80px' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                                                 <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${is3DModelActive ? 'bg-yellow-400 animate-pulse' : 'bg-gray-400'}`}></div>
                           <span className="text-white/90 text-xs">{is3DModelActive ? 'Active Controls' : 'Controls Paused'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${is3DModelActive ? 'bg-purple-400 animate-pulse' : 'bg-gray-400'}`}></div>
                           <span className="text-white/90 text-xs">{is3DModelActive ? '3D Navigation' : 'Navigation Paused'}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-white/90 text-xs">VitalSync Powered</span>
                      </div>
                    </div>
                  </div>
               </div>
             </div>

             {/* Controls - Right Side */}
             <div className="w-1/2 space-y-6">
               {/* Simulation Controls */}
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                   <Settings className="h-5 w-5" />
                   Simulation Controls
                 </h3>
                 <div className="flex flex-col gap-3">
                                       <Button 
                      onClick={startSimulation}
                      disabled={isSimulationActive}
                      className="bg-green-600 hover:bg-green-700 w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start 3D Model
                    </Button>
                    <Button 
                      onClick={stopSimulation}
                      disabled={!isSimulationActive}
                      variant="outline"
                      className="w-full"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Stop 3D Model
                    </Button>
                                       <Button onClick={resetSimulation} variant="outline" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                 </div>
               </div>

               {/* Quick Stats */}
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                   <Target className="h-5 w-5" />
                   Quick Stats
                 </h3>
                 <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                     <div className="text-2xl font-bold text-blue-600">{drones.length}</div>
                     <div className="text-xs text-muted-foreground">Active Drones</div>
                   </div>
                   <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                     <div className="text-2xl font-bold text-green-600">
                       {deliveries.filter(d => d.status === 'delivered').length}
                     </div>
                     <div className="text-xs text-muted-foreground">Completed</div>
                   </div>
                   <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                     <div className="text-2xl font-bold text-purple-600">
                       {deliveries.filter(d => d.status === 'in-flight').length}
                     </div>
                     <div className="text-xs text-muted-foreground">In Flight</div>
                   </div>
                   <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                     <div className="text-2xl font-bold text-orange-600">98.5%</div>
                     <div className="text-xs text-muted-foreground">Success Rate</div>
                   </div>
                 </div>
               </div>

               {/* Weather & Conditions */}
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                   <Thermometer className="h-5 w-5" />
                   Weather & Conditions
                 </h3>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                     <span className="text-sm">Weather</span>
                     <Badge className="bg-green-100 text-green-800">Optimal</Badge>
                   </div>
                   <div className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                     <span className="text-sm">Air Traffic</span>
                     <Badge className="bg-blue-100 text-blue-800">Clear</Badge>
                   </div>
                   <div className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                     <span className="text-sm">Wind Speed</span>
                     <span className="text-sm font-medium">8 km/h</span>
                   </div>
                   <div className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                     <span className="text-sm">Temperature</span>
                     <span className="text-sm font-medium">22°C</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </CardContent>
       </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drones">Drones</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{drones.length}</div>
                <p className="text-sm text-muted-foreground">Active Drones</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {deliveries.filter(d => d.status === 'delivered').length}
                </div>
                <p className="text-sm text-muted-foreground">Completed Deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {deliveries.filter(d => d.status === 'in-flight').length}
                </div>
                <p className="text-sm text-muted-foreground">In Flight</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${backendConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {backendConnected ? 'Online' : 'Offline'}
                </div>
                <p className="text-sm text-muted-foreground">Backend Status</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Drone Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Live Drone Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drones.map(drone => (
                  <Card key={drone.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{drone.name}</h4>
                        <Badge variant={drone.status === 'available' ? 'default' : 'secondary'}>
                          {drone.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4" />
                          <span className="text-sm">{drone.battery.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Signal className="h-4 w-4" />
                          <span className="text-sm">{drone.signal}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span className="text-sm">{drone.altitude}m</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm">{drone.speed} km/h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drones" className="space-y-4">
          <Card>
            <CardHeader>
                             <CardTitle className="flex items-center gap-2">
                 <Plane className="h-5 w-5" />
                 Drone Fleet Management
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drones.map(drone => (
                  <div key={drone.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                         <Plane className="w-6 h-6 text-white" />
                       </div>
                      <div>
                        <h4 className="font-semibold">{drone.name}</h4>
                        <p className="text-sm text-muted-foreground">ID: {drone.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{drone.battery.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Battery</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{drone.signal}%</div>
                        <div className="text-xs text-muted-foreground">Signal</div>
                      </div>
                      <Badge variant={drone.status === 'available' ? 'default' : 'secondary'}>
                        {drone.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Active Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveries.map(delivery => (
                  <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{delivery.packageId}</h4>
                        <p className="text-sm text-muted-foreground">{delivery.destination}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(delivery.status)}>
                          {delivery.status}
                        </Badge>
                        <Badge className={getPriorityColor(delivery.priority)}>
                          {delivery.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Drone:</span>
                        <div className="font-medium">{delivery.droneId}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ETA:</span>
                        <div className="font-medium">{delivery.estimatedTime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Distance:</span>
                        <div className="font-medium">{delivery.distance}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Items:</span>
                        <div className="font-medium">{delivery.items.length}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-muted-foreground mb-1">Package Contents:</div>
                      <div className="flex flex-wrap gap-1">
                        {delivery.items.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Delivery Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-bold text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Delivery Time</span>
                    <span className="font-bold text-blue-600">18 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deliveries Today</span>
                    <span className="font-bold text-purple-600">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Efficiency</span>
                    <span className="font-bold text-orange-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Weather Conditions</span>
                    <span className="font-bold text-green-600">Optimal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Air Traffic</span>
                    <span className="font-bold text-blue-600">Clear</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery Health</span>
                    <span className="font-bold text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signal Strength</span>
                    <span className="font-bold text-green-600">Strong</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
