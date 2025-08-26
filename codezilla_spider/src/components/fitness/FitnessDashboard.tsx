import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Dumbbell, 
  Heart, 
  Target, 
  TrendingUp, 
  Calendar,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Settings,
  BarChart3,
  Users,
  Award,
  Zap,
  Brain,
  Shield,
  Clock,
  Star,
  Sun,
  Moon,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FitnessDashboardProps {
  className?: string;
}

export const FitnessDashboard: React.FC<FitnessDashboardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTracking, setIsTracking] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [heartRate, setHeartRate] = useState(72);
  const [currentExercise, setCurrentExercise] = useState('');
  const [workoutProgress, setWorkoutProgress] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [stepsToday, setStepsToday] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [targetWater, setTargetWater] = useState(2000);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Fitness data
  const [fitnessStats, setFitnessStats] = useState({
    weeklyWorkouts: 4,
    totalWorkoutTime: 180,
    averageHeartRate: 140,
    strengthProgress: 75,
    flexibilityProgress: 60,
    enduranceProgress: 80
  });

  const [recentWorkouts, setRecentWorkouts] = useState([
    { name: 'Full Body HIIT', duration: 45, calories: 450, date: '2024-01-15' },
    { name: 'Strength Training', duration: 60, calories: 380, date: '2024-01-14' },
    { name: 'Yoga Flow', duration: 30, calories: 180, date: '2024-01-13' },
    { name: 'Cardio Blast', duration: 40, calories: 420, date: '2024-01-12' }
  ]);

  const [exerciseLibrary, setExerciseLibrary] = useState([
    { name: 'Push-ups', category: 'Strength', difficulty: 'Beginner', equipment: 'None', calories: 8 },
    { name: 'Squats', category: 'Strength', difficulty: 'Beginner', equipment: 'None', calories: 10 },
    { name: 'Plank', category: 'Core', difficulty: 'Intermediate', equipment: 'None', calories: 5 },
    { name: 'Burpees', category: 'Cardio', difficulty: 'Advanced', equipment: 'None', calories: 15 },
    { name: 'Mountain Climbers', category: 'Cardio', difficulty: 'Intermediate', equipment: 'None', calories: 12 },
    { name: 'Jumping Jacks', category: 'Cardio', difficulty: 'Beginner', equipment: 'None', calories: 8 }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTracking) {
        setExerciseCount(prev => prev + 1);
        setWorkoutProgress(prev => Math.min(100, prev + 2));
        setHeartRate(prev => Math.min(180, prev + Math.random() * 5));
        setCaloriesBurned(prev => prev + Math.random() * 10);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const startWorkout = () => {
    setIsTracking(true);
    setWorkoutProgress(0);
    setExerciseCount(0);
  };

  const stopWorkout = () => {
    setIsTracking(false);
  };

  const resetWorkout = () => {
    setIsTracking(false);
    setWorkoutProgress(0);
    setExerciseCount(0);
    setHeartRate(72);
    setCaloriesBurned(0);
  };

  const getHeartRateZone = () => {
    if (heartRate < 100) return { zone: 'Resting', color: 'text-blue-500' };
    if (heartRate < 120) return { zone: 'Warm Up', color: 'text-green-500' };
    if (heartRate < 140) return { zone: 'Fat Burning', color: 'text-yellow-500' };
    if (heartRate < 160) return { zone: 'Aerobic', color: 'text-orange-500' };
    return { zone: 'Anaerobic', color: 'text-red-500' };
  };

  const heartRateZone = getHeartRateZone();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fitness Dashboard
          </h1>
          <p className="text-muted-foreground">Track your fitness journey and achieve your goals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={startWorkout} disabled={isTracking} className="bg-gradient-to-r from-green-500 to-blue-600">
            <Play className="h-4 w-4 mr-2" />
            Start Workout
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Steps Today</p>
                <p className="text-2xl font-bold">{stepsToday.toLocaleString()}</p>
                <Progress value={(stepsToday / dailyGoal) * 100} className="mt-2" />
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calories Burned</p>
                <p className="text-2xl font-bold">{caloriesBurned}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-bold">{heartRate} BPM</p>
                <p className={`text-xs ${heartRateZone.color}`}>{heartRateZone.zone}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Water Intake</p>
                <p className="text-2xl font-bold">{waterIntake}ml</p>
                <Progress value={(waterIntake / targetWater) * 100} className="mt-2" />
              </div>
              <Target className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Current Workout Status */}
          {isTracking && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Active Workout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{exerciseCount}</p>
                    <p className="text-sm text-muted-foreground">Reps Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{workoutProgress}%</p>
                    <p className="text-sm text-muted-foreground">Workout Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{heartRate}</p>
                    <p className="text-sm text-muted-foreground">Heart Rate (BPM)</p>
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button onClick={stopWorkout} variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={resetWorkout} variant="destructive">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fitness Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Fitness Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Strength</span>
                      <span>{fitnessStats.strengthProgress}%</span>
                    </div>
                    <Progress value={fitnessStats.strengthProgress} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Flexibility</span>
                      <span>{fitnessStats.flexibilityProgress}%</span>
                    </div>
                    <Progress value={fitnessStats.flexibilityProgress} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Endurance</span>
                      <span>{fitnessStats.enduranceProgress}%</span>
                    </div>
                    <Progress value={fitnessStats.enduranceProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentWorkouts.slice(0, 3).map((workout, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">{workout.duration} min • {workout.calories} cal</p>
                      </div>
                      <Badge variant="secondary">{workout.date}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Full Body HIIT', duration: 45, difficulty: 'Advanced', calories: 450, icon: <Zap className="h-6 w-6" /> },
              { name: 'Strength Training', duration: 60, difficulty: 'Intermediate', calories: 380, icon: <Dumbbell className="h-6 w-6" /> },
              { name: 'Yoga Flow', duration: 30, difficulty: 'Beginner', calories: 180, icon: <Activity className="h-6 w-6" /> },
              { name: 'Cardio Blast', duration: 40, difficulty: 'Intermediate', calories: 420, icon: <Heart className="h-6 w-6" /> },
              { name: 'Core Crusher', duration: 25, difficulty: 'Beginner', calories: 200, icon: <Target className="h-6 w-6" /> },
              { name: 'Flexibility Focus', duration: 35, difficulty: 'Beginner', calories: 150, icon: <Activity className="h-6 w-6" /> }
            ].map((workout, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {workout.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{workout.name}</h3>
                      <p className="text-sm text-muted-foreground">{workout.duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={workout.difficulty === 'Advanced' ? 'destructive' : workout.difficulty === 'Intermediate' ? 'default' : 'secondary'}>
                      {workout.difficulty}
                    </Badge>
                    <span className="text-sm font-medium">{workout.calories} cal</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exerciseLibrary.map((exercise, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <Badge variant="outline">{exercise.category}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Difficulty: {exercise.difficulty}</p>
                    <p>Equipment: {exercise.equipment}</p>
                    <p>Calories/min: {exercise.calories}</p>
                  </div>
                  <Button className="w-full mt-3" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Exercise
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Workouts</span>
                    <span className="font-semibold">{fitnessStats.weeklyWorkouts}/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Time</span>
                    <span className="font-semibold">{fitnessStats.totalWorkoutTime} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avg Heart Rate</span>
                    <span className="font-semibold">{fitnessStats.averageHeartRate} BPM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">7-Day Streak</p>
                      <p className="text-sm text-muted-foreground">Completed workouts for 7 consecutive days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Goal Crusher</p>
                      <p className="text-sm text-muted-foreground">Exceeded weekly step goal by 20%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Cardio Master</p>
                      <p className="text-sm text-muted-foreground">Completed 5 cardio sessions this week</p>
                    </div>
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

