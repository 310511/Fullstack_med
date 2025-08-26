import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Package, Box, AlertTriangle } from 'lucide-react';

interface DroneDeliveryProps {
  className?: string;
}

export const DroneDeliveryEnhanced: React.FC<DroneDeliveryProps> = ({ className }) => {
  const [show3DVisualization, setShow3DVisualization] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Connect to backend
  useEffect(() => {
    const connectToBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/status');
        if (response.ok) {
          setBackendConnected(true);
        }
      } catch (error) {
        console.log('Backend not available');
      }
    };
    connectToBackend();
  }, []);

  const launch3DVisualization = () => {
    setShow3DVisualization(true);
  };

  const close3DVisualization = () => {
    setShow3DVisualization(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🚁 Enhanced Drone Delivery
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced 3D visualization and real-time monitoring
          </p>
        </div>
        <div className="flex gap-3">
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
                src="/drone_dashboard.html"
                className="w-full h-full border-0 rounded"
                title="3D Drone Visualization"
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Backend Status</p>
                <p className={`text-lg font-bold ${backendConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {backendConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">3D Visualization</p>
                <p className="text-lg font-bold text-blue-600">Ready</p>
              </div>
              <Box className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
              <Plane className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Step 1: Start Backend</h3>
              <p className="text-blue-700 dark:text-blue-300">
                Run the backend server: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">python backend_server.py</code>
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200">Step 2: Launch 3D Visualization</h3>
              <p className="text-green-700 dark:text-green-300">
                Click the "Launch 3D Visualization" button to open the interactive 3D drone control interface.
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Step 3: Control Drones</h3>
              <p className="text-purple-700 dark:text-purple-300">
                Use the 3D interface to control drones, monitor missions, and manage the fleet in real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
