import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Plus, 
  TrendingUp, 
  Heart, 
  Zap, 
  Brain, 
  Droplets, 
  Moon, 
  Sun, 
  Bell, 
  Settings, 
  Activity, 
  Thermometer, 
  Droplet, 
  Coffee, 
  BookOpen, 
  HelpCircle, 
  Download, 
  Upload, 
  Baby, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  BarChart3 as BarChart3Icon,
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';

interface PeriodTrackerProps {
  className?: string;
}

export const PeriodTracker: React.FC<PeriodTrackerProps> = ({ className }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cycles, setCycles] = useState<any[]>([]);
  const [dailyLogs, setDailyLogs] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [showLogModal, setShowLogModal] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState({
    cycleLength: 28,
    periodLength: 5,
    notifyPeriod: true,
    notifyOvulation: true,
    notifyFertile: false,
    theme: 'dark',
    pregnancyMode: false,
    partnerSharing: false,
    irregularCycleAlert: true,
    medicationReminders: false
  });
  const [showCycleStartModal, setShowCycleStartModal] = useState(false);
  const [showCycleEndModal, setShowCycleEndModal] = useState(false);
  const [tempCycleStart, setTempCycleStart] = useState('');
  const [tempCycleEnd, setTempCycleEnd] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [irregularCycleDetected, setIrregularCycleDetected] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedCycles = localStorage.getItem('periodTrackerCycles');
    const savedLogs = localStorage.getItem('periodTrackerLogs');
    const savedSettings = localStorage.getItem('periodTrackerSettings');
    
    if (savedCycles) setCycles(JSON.parse(savedCycles));
    if (savedLogs) setDailyLogs(JSON.parse(savedLogs));
    if (savedSettings) setUserSettings(JSON.parse(savedSettings));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('periodTrackerCycles', JSON.stringify(cycles));
    calculatePredictions(cycles);
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem('periodTrackerLogs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('periodTrackerSettings', JSON.stringify(userSettings));
    checkForNotifications();
  }, [userSettings, predictions]);

  // Initialize with sample data if no data exists
  useEffect(() => {
    if (cycles.length === 0 && Object.keys(dailyLogs).length === 0) {
      const sampleCycles = [
        { 
          startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], 
          endDate: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString().split('T')[0], 
          length: 28 
        },
        { 
          startDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], 
          endDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0], 
          length: 28 
        },
      ];
      setCycles(sampleCycles);
      
      const sampleLogs = {
        [new Date().toISOString().split('T')[0]]: { 
          symptoms: ['cramps', 'headache'], 
          mood: 'irritable', 
          energy: 3, 
          flow: 'heavy',
          notes: 'Had a tough day with strong cramps',
          temperature: 36.8,
          weight: 62.5
        },
        [new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]]: { 
          symptoms: ['bloating'], 
          mood: 'sad', 
          energy: 2, 
          flow: 'medium',
          notes: 'Felt very bloated today',
          temperature: 36.6,
          weight: 62.7
        },
      };
      setDailyLogs(sampleLogs);
    }
  }, []);

  const detectIrregularCycles = (cycleData: any[]) => {
    if (cycleData.length < 3) return false;
    
    const cycleLengths = cycleData.map(cycle => cycle.length);
    const averageLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
    const variance = cycleLengths.reduce((acc, length) => acc + Math.pow(length - averageLength, 2), 0) / cycleLengths.length;
    const standardDeviation = Math.sqrt(variance);
    
    return standardDeviation > 3; // Irregular if standard deviation > 3 days
  };

  const calculatePredictions = (cycleData: any[]) => {
    if (cycleData.length < 2) return;

    const recentCycles = cycleData.slice(-3);
    const averageCycleLength = recentCycles.reduce((sum, cycle) => sum + cycle.length, 0) / recentCycles.length;
    const lastCycleStart = new Date(recentCycles[recentCycles.length - 1].startDate);
    
    const nextPeriodStart = new Date(lastCycleStart);
    nextPeriodStart.setDate(lastCycleStart.getDate() + averageCycleLength);
    
    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(nextPeriodStart.getDate() - 14);
    
    const fertileWindowStart = new Date(ovulationDate);
    fertileWindowStart.setDate(ovulationDate.getDate() - 5);
    
    const fertileWindowEnd = new Date(ovulationDate);
    fertileWindowEnd.setDate(ovulationDate.getDate() + 1);

    setPredictions({
      nextPeriod: nextPeriodStart.toISOString().split('T')[0],
      ovulation: ovulationDate.toISOString().split('T')[0],
      fertileWindow: {
        start: fertileWindowStart.toISOString().split('T')[0],
        end: fertileWindowEnd.toISOString().split('T')[0]
      },
      averageCycleLength: Math.round(averageCycleLength)
    });

    // Check for irregular cycles
    const isIrregular = detectIrregularCycles(cycleData);
    setIrregularCycleDetected(isIrregular);
  };

  const checkForNotifications = () => {
    if (!predictions) return;

    const today = new Date().toISOString().split('T')[0];
    const notifications = [];

    // Period notification
    if (userSettings.notifyPeriod && predictions.nextPeriod === today) {
      notifications.push({
        type: 'period',
        message: 'Your period is predicted to start today',
        priority: 'high'
      });
    }

    // Ovulation notification
    if (userSettings.notifyOvulation && predictions.ovulation === today) {
      notifications.push({
        type: 'ovulation',
        message: 'You are likely ovulating today',
        priority: 'medium'
      });
    }

    // Fertile window notification
    if (userSettings.notifyFertile && 
        today >= predictions.fertileWindow.start && 
        today <= predictions.fertileWindow.end) {
      notifications.push({
        type: 'fertile',
        message: 'You are in your fertile window',
        priority: 'medium'
      });
    }

    setNotifications(notifications);
  };

  const getCurrentCyclePhase = () => {
    if (!predictions) return 'unknown';

    const today = new Date().toISOString().split('T')[0];
    const lastPeriodStart = new Date(cycles[cycles.length - 1]?.startDate);
    const daysSincePeriod = Math.floor((new Date(today).getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSincePeriod < 0) return 'unknown';
    if (daysSincePeriod <= userSettings.periodLength) return 'period';
    if (daysSincePeriod <= 14) return 'follicular';
    if (daysSincePeriod <= 16) return 'ovulation';
    if (daysSincePeriod <= 28) return 'luteal';
    return 'late';
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'period': return 'text-red-500';
      case 'follicular': return 'text-blue-500';
      case 'ovulation': return 'text-pink-500';
      case 'luteal': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getPhaseName = (phase: string) => {
    switch (phase) {
      case 'period': return 'Menstrual Phase';
      case 'follicular': return 'Follicular Phase';
      case 'ovulation': return 'Ovulation';
      case 'luteal': return 'Luteal Phase';
      default: return 'Unknown Phase';
    }
  };

  const currentPhase = getCurrentCyclePhase();

  // Sample data for charts
  const cycleHistoryData = [
    { month: 'Jan', length: 28, symptoms: 3 },
    { month: 'Feb', length: 29, symptoms: 2 },
    { month: 'Mar', length: 27, symptoms: 4 },
    { month: 'Apr', length: 28, symptoms: 2 },
    { month: 'May', length: 30, symptoms: 3 },
    { month: 'Jun', length: 28, symptoms: 1 }
  ];

  const symptomsData = [
    { name: 'Cramps', value: 45, color: '#EF4444' },
    { name: 'Bloating', value: 30, color: '#F59E0B' },
    { name: 'Fatigue', value: 25, color: '#3B82F6' }
  ];

  const moodData = [
    { day: 'Mon', mood: 3 },
    { day: 'Tue', mood: 4 },
    { day: 'Wed', mood: 2 },
    { day: 'Thu', mood: 5 },
    { day: 'Fri', mood: 4 },
    { day: 'Sat', mood: 5 },
    { day: 'Sun', mood: 3 }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Period Tracker
        </h1>
        <p className="text-muted-foreground">Track your cycle, monitor fertility, and understand your body</p>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${getPhaseColor(currentPhase)}`}>
                {getPhaseName(currentPhase)}
              </div>
              <p className="text-sm text-muted-foreground">Current Phase</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {predictions?.averageCycleLength || 28} days
              </div>
              <p className="text-sm text-muted-foreground">Average Cycle</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {cycles.length}
              </div>
              <p className="text-sm text-muted-foreground">Cycles Tracked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Cycle Calendar
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                      date.setDate(date.getDate() + i - date.getDay());
                      const dateString = date.toISOString().split('T')[0];
                      const isPeriod = cycles.some(cycle => 
                        dateString >= cycle.startDate && dateString <= cycle.endDate
                      );
                      const isOvulation = predictions?.ovulation === dateString;
                      const isFertile = predictions?.fertileWindow && 
                        dateString >= predictions.fertileWindow.start && 
                        dateString <= predictions.fertileWindow.end;
                      
                      return (
                        <div
                          key={i}
                          className={`p-2 text-center text-sm border rounded cursor-pointer hover:bg-muted/50 ${
                            isPeriod ? 'bg-red-100 text-red-800 border-red-300' :
                            isOvulation ? 'bg-pink-100 text-pink-800 border-pink-300' :
                            isFertile ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            'hover:bg-muted/50'
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Today's Symptoms
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Start New Cycle
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    End Current Cycle
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              {notifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {notifications.map((notification, index) => (
                        <div key={index} className="p-2 rounded-lg bg-muted/50">
                          <p className="text-sm font-medium">{notification.message}</p>
                          <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'}>
                            {notification.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Cycle Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                        <div>
                          <p className="font-medium">Next Period</p>
                          <p className="text-sm text-muted-foreground">Predicted start date</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">
                            {new Date(predictions.nextPeriod).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-pink-50 dark:bg-pink-950/20">
                        <div>
                          <p className="font-medium">Ovulation</p>
                          <p className="text-sm text-muted-foreground">Most fertile day</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-pink-600">
                            {new Date(predictions.ovulation).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                        <div>
                          <p className="font-medium">Fertile Window</p>
                          <p className="text-sm text-muted-foreground">High fertility period</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">
                            {new Date(predictions.fertileWindow.start).toLocaleDateString()} - {new Date(predictions.fertileWindow.end).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Track at least 2 cycles to see predictions
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cycle Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Cycle Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Average Cycle Length</span>
                    <span className="font-bold">{predictions?.averageCycleLength || 28} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Period Length</span>
                    <span className="font-bold">{userSettings.periodLength} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cycles Tracked</span>
                    <span className="font-bold">{cycles.length}</span>
                  </div>
                  {irregularCycleDetected && (
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Irregular cycles detected. Consider consulting a healthcare provider.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cycle History */}
            <Card>
              <CardHeader>
                <CardTitle>Cycle Length History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cycleHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="length" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Symptoms Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Common Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={symptomsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {symptomsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {symptomsData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mood" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Health Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Health Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Your cycle is regular and within normal range
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Consider tracking basal body temperature for more accurate ovulation prediction
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyPeriod">Period Notifications</Label>
                    <input
                      id="notifyPeriod"
                      type="checkbox"
                      checked={userSettings.notifyPeriod}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, notifyPeriod: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyOvulation">Ovulation Notifications</Label>
                    <input
                      id="notifyOvulation"
                      type="checkbox"
                      checked={userSettings.notifyOvulation}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, notifyOvulation: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyFertile">Fertile Window Notifications</Label>
                    <input
                      id="notifyFertile"
                      type="checkbox"
                      checked={userSettings.notifyFertile}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, notifyFertile: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cycle Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cycle Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
                  <Input
                    id="cycleLength"
                    type="number"
                    value={userSettings.cycleLength}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, cycleLength: parseInt(e.target.value) }))}
                    min="21"
                    max="35"
                  />
                </div>
                <div>
                  <Label htmlFor="periodLength">Average Period Length (days)</Label>
                  <Input
                    id="periodLength"
                    type="number"
                    value={userSettings.periodLength}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, periodLength: parseInt(e.target.value) }))}
                    min="2"
                    max="10"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
