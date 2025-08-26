import React, { useState, useEffect } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Hand,
  Wifi,
  Battery,
  Volume2,
  Sun,
  Moon,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const MobileTest: React.FC = () => {
  const { isMobile, isTablet, isDesktop, screenSize, isLandscape, isPortrait } = useMobile();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [touchSupported, setTouchSupported] = useState(false);
  const [pwaSupported, setPwaSupported] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [geolocationSupported, setGeolocationSupported] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [microphoneSupported, setMicrophoneSupported] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check device capabilities
    setTouchSupported('ontouchstart' in window);
    setPwaSupported('serviceWorker' in navigator);
    setNotificationsSupported('Notification' in window);
    setGeolocationSupported('geolocation' in navigator);
    setCameraSupported('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices);
    setMicrophoneSupported('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices);

    // Check battery level if supported
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level * 100);
      });
    }

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const runTests = () => {
    const results = {
      touch: touchSupported,
      pwa: pwaSupported,
      notifications: notificationsSupported,
      geolocation: geolocationSupported,
      camera: cameraSupported,
      microphone: microphoneSupported,
      online: isOnline,
      battery: batteryLevel !== null,
    };
    setTestResults(results);
  };

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="h-6 w-6 text-blue-500" />;
    if (isTablet) return <Tablet className="h-6 w-6 text-green-500" />;
    return <Monitor className="h-6 w-6 text-purple-500" />;
  };

  const getStatusIcon = (supported: boolean) => {
    return supported ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getBatteryIcon = (level: number | null) => {
    if (level === null) return <Battery className="h-4 w-4 text-gray-400" />;
    if (level > 50) return <Battery className="h-4 w-4 text-green-500" />;
    if (level > 20) return <Battery className="h-4 w-4 text-yellow-500" />;
    return <Battery className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            {getDeviceIcon()}
            📱 Mobile Responsiveness Test
            <Badge variant="secondary" className="text-xs">
              {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive mobile feature testing and device capability detection
          </p>
        </CardHeader>
      </Card>

      {/* Device Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {getDeviceIcon()}
              <h3 className="font-semibold">Device Type</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {isMobile ? 'Mobile Device' : isTablet ? 'Tablet Device' : 'Desktop Device'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Maximize2 className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Screen Size</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {screenSize.width} × {screenSize.height} px
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Orientation</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {isLandscape ? 'Landscape' : 'Portrait'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Features Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Mobile Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                                  <Hand className="h-4 w-4" />
                <span className="text-sm font-medium">Touch Navigation</span>
                </div>
                <Badge variant={touchSupported ? "default" : "secondary"}>
                  {touchSupported ? "Supported" : "Not Supported"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm font-medium">Network Status</span>
                </div>
                <Badge variant={isOnline ? "default" : "destructive"}>
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  {getBatteryIcon(batteryLevel)}
                  <span className="text-sm font-medium">Battery Level</span>
                </div>
                <Badge variant={batteryLevel !== null ? "default" : "secondary"}>
                  {batteryLevel !== null ? `${Math.round(batteryLevel)}%` : "Unknown"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Device Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { name: 'PWA Support', supported: pwaSupported, icon: <Zap className="h-4 w-4" /> },
                { name: 'Notifications', supported: notificationsSupported, icon: <Volume2 className="h-4 w-4" /> },
                { name: 'Geolocation', supported: geolocationSupported, icon: <Maximize2 className="h-4 w-4" /> },
                { name: 'Camera', supported: cameraSupported, icon: <Maximize2 className="h-4 w-4" /> },
                { name: 'Microphone', supported: microphoneSupported, icon: <Volume2 className="h-4 w-4" /> },
              ].map((feature) => (
                <div key={feature.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    {feature.icon}
                    <span className="text-sm font-medium">{feature.name}</span>
                  </div>
                  {getStatusIcon(feature.supported)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Grid Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="h-5 w-5 text-blue-500" />
            Responsive Grid Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div 
                key={item} 
                className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-border/50 text-center transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <div className="text-2xl mb-2">📱</div>
                <div className="text-sm font-medium">Item {item}</div>
                <div className="text-xs text-muted-foreground">Responsive</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Buttons Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                            <Hand className="h-5 w-5 text-green-500" />
                Touch Interaction Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105">
              Primary Action
            </Button>
            <Button variant="outline" className="flex-1 h-12 text-base font-medium hover:bg-muted/50 transition-all duration-200 hover:scale-105">
              Secondary Action
            </Button>
            <Button variant="ghost" className="flex-1 h-12 text-base font-medium hover:bg-muted/50 transition-all duration-200 hover:scale-105">
              Tertiary Action
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1 rounded-xl">
              <Sun className="h-5 w-5" />
              <span className="text-xs">Light Mode</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1 rounded-xl">
              <Moon className="h-5 w-5" />
              <span className="text-xs">Dark Mode</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runTests} className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
              Run All Tests
            </Button>
            <div className="flex-1">
              <Progress 
                value={Object.values(testResults).filter(Boolean).length / Object.keys(testResults).length * 100} 
                className="h-2"
              />
            </div>
          </div>
          
          {Object.keys(testResults).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(testResults).map(([test, passed]) => (
                <div key={test} className={`p-2 rounded-lg text-center text-xs font-medium ${
                  passed ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {test.charAt(0).toUpperCase() + test.slice(1)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              This component demonstrates mobile responsiveness features.
            </p>
            <p className="text-xs text-muted-foreground">
              Resize your browser window or use device simulation to see the layout adapt.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>💡</span>
              <span>Try rotating your device or resizing the browser window</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
