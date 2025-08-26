import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Dumbbell, 
  Apple, 
  Target, 
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  Zap,
  Activity,
  Users,
  Settings,
  CheckCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AIWellnessPlannerProps {
  className?: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  difficulty: string;
  duration: number;
  exercises: Exercise[];
  calories: number;
  targetMuscles: string[];
  mood: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  rest: number;
  instructions: string;
  muscleGroup: string;
}

interface MealPlan {
  id: string;
  name: string;
  goal: 'cutting' | 'bulking' | 'maintenance';
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string;
  prepTime: number;
}

export const AIWellnessPlanner: React.FC<AIWellnessPlannerProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState({
    age: 25,
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    goal: 'maintenance',
    fitnessLevel: 'intermediate',
    availableTime: 45,
    preferences: ['strength', 'cardio']
  });
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutProgress, setWorkoutProgress] = useState(0);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Sample workout plans
  const workoutPlans: WorkoutPlan[] = [
    {
      id: '1',
      name: 'Morning Energy Boost',
      difficulty: 'beginner',
      duration: 30,
      calories: 250,
      targetMuscles: ['full body'],
      mood: 'energetic',
      exercises: [
        {
          id: '1',
          name: 'Jumping Jacks',
          sets: 3,
          reps: 20,
          rest: 30,
          instructions: 'Start with feet together, jump to spread legs and raise arms',
          muscleGroup: 'cardio'
        },
        {
          id: '2',
          name: 'Push-ups',
          sets: 3,
          reps: 10,
          rest: 60,
          instructions: 'Keep body straight, lower chest to ground',
          muscleGroup: 'chest'
        },
        {
          id: '3',
          name: 'Squats',
          sets: 3,
          reps: 15,
          rest: 60,
          instructions: 'Feet shoulder-width apart, lower hips back and down',
          muscleGroup: 'legs'
        }
      ]
    },
    {
      id: '2',
      name: 'Strength Builder',
      difficulty: 'intermediate',
      duration: 45,
      calories: 350,
      targetMuscles: ['upper body', 'core'],
      mood: 'focused',
      exercises: [
        {
          id: '1',
          name: 'Diamond Push-ups',
          sets: 4,
          reps: 12,
          rest: 90,
          instructions: 'Form diamond with hands, focus on triceps',
          muscleGroup: 'triceps'
        },
        {
          id: '2',
          name: 'Plank Hold',
          sets: 3,
          reps: 1,
          duration: 60,
          rest: 60,
          instructions: 'Hold plank position with straight body',
          muscleGroup: 'core'
        },
        {
          id: '3',
          name: 'Pull-ups',
          sets: 3,
          reps: 8,
          rest: 120,
          instructions: 'Pull body up until chin over bar',
          muscleGroup: 'back'
        }
      ]
    }
  ];

  // Sample meal plans
  const mealPlans: MealPlan[] = [
    {
      id: '1',
      name: 'Balanced Nutrition',
      goal: 'maintenance',
      totalCalories: 2000,
      macros: { protein: 150, carbs: 200, fats: 67 },
      meals: [
        {
          id: '1',
          name: 'Protein Oatmeal Bowl',
          type: 'breakfast',
          calories: 450,
          protein: 25,
          carbs: 60,
          fats: 15,
          prepTime: 10,
          ingredients: ['Oats', 'Protein powder', 'Banana', 'Almonds', 'Honey'],
          instructions: 'Cook oats, mix in protein powder, top with banana and almonds'
        },
        {
          id: '2',
          name: 'Grilled Chicken Salad',
          type: 'lunch',
          calories: 550,
          protein: 45,
          carbs: 25,
          fats: 25,
          prepTime: 15,
          ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Olive oil', 'Balsamic'],
          instructions: 'Grill chicken, assemble salad with fresh vegetables'
        },
        {
          id: '3',
          name: 'Salmon with Quinoa',
          type: 'dinner',
          calories: 600,
          protein: 40,
          carbs: 45,
          fats: 30,
          prepTime: 20,
          ingredients: ['Salmon fillet', 'Quinoa', 'Broccoli', 'Lemon', 'Herbs'],
          instructions: 'Bake salmon, cook quinoa, steam broccoli'
        }
      ]
    }
  ];

  useEffect(() => {
    // Set default plans
    setCurrentWorkout(workoutPlans[0]);
    setCurrentMealPlan(mealPlans[0]);
  }, []);

  const generateWorkoutPlan = () => {
    // AI logic to generate personalized workout
    const availableTime = userProfile.availableTime;
    const fitnessLevel = userProfile.fitnessLevel;
    const goal = userProfile.goal;
    
    // Simple AI logic - in real implementation, this would use more sophisticated algorithms
    let selectedPlan = workoutPlans[0];
    
    if (availableTime >= 45 && fitnessLevel === 'intermediate') {
      selectedPlan = workoutPlans[1];
    }
    
    setCurrentWorkout(selectedPlan);
  };

  const generateMealPlan = () => {
    // AI logic to generate personalized meal plan
    const goal = userProfile.goal;
    const activityLevel = userProfile.activityLevel;
    
    // Adjust calories based on goal and activity
    let baseCalories = 2000;
    if (goal === 'cutting') baseCalories -= 300;
    if (goal === 'bulking') baseCalories += 300;
    if (activityLevel === 'high') baseCalories += 200;
    
    const adjustedPlan = {
      ...mealPlans[0],
      totalCalories: baseCalories,
      macros: {
        protein: Math.round(baseCalories * 0.3 / 4),
        carbs: Math.round(baseCalories * 0.4 / 4),
        fats: Math.round(baseCalories * 0.3 / 9)
      }
    };
    
    setCurrentMealPlan(adjustedPlan);
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutProgress(0);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const resetWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutProgress(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'cutting': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'bulking': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'maintenance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Wellness Planner
        </h1>
        <p className="text-muted-foreground">Personalized workout and nutrition plans powered by AI</p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Profile
            </span>
            <Button size="sm" variant="outline" onClick={() => setShowProfileSetup(!showProfileSetup)}>
              <Settings className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProfile.age}</div>
              <p className="text-sm text-muted-foreground">Age</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProfile.weight}kg</div>
              <p className="text-sm text-muted-foreground">Weight</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userProfile.height}cm</div>
              <p className="text-sm text-muted-foreground">Height</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userProfile.availableTime}min</div>
              <p className="text-sm text-muted-foreground">Available Time</p>
            </div>
          </div>
          
          {showProfileSetup && (
            <div className="mt-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Age</Label>
                  <Input 
                    type="number" 
                    value={userProfile.age}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input 
                    type="number" 
                    value={userProfile.weight}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <Input 
                    type="number" 
                    value={userProfile.height}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Goal</Label>
                  <Select value={userProfile.goal} onValueChange={(value) => setUserProfile(prev => ({ ...prev, goal: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cutting">Weight Loss</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="bulking">Muscle Gain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Workout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Today's Workout
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentWorkout ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{currentWorkout.name}</h3>
                      <Badge className={getDifficultyColor(currentWorkout.difficulty)}>
                        {currentWorkout.difficulty}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{currentWorkout.duration}min</div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{currentWorkout.calories}</div>
                        <p className="text-xs text-muted-foreground">Calories</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{currentWorkout.exercises.length}</div>
                        <p className="text-xs text-muted-foreground">Exercises</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={startWorkout} className="flex-1" disabled={isWorkoutActive}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Workout
                      </Button>
                      <Button onClick={generateWorkoutPlan} variant="outline">
                        <Brain className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Button onClick={generateWorkoutPlan}>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Workout Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Meal Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  Today's Nutrition
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentMealPlan ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{currentMealPlan.name}</h3>
                      <Badge className={getGoalColor(currentMealPlan.goal)}>
                        {currentMealPlan.goal}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{currentMealPlan.totalCalories}</div>
                        <p className="text-xs text-muted-foreground">Calories</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{currentMealPlan.macros.protein}g</div>
                        <p className="text-xs text-muted-foreground">Protein</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{currentMealPlan.meals.length}</div>
                        <p className="text-xs text-muted-foreground">Meals</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Plan
                      </Button>
                      <Button onClick={generateMealPlan} variant="outline">
                        <Brain className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Button onClick={generateMealPlan}>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Meal Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          {/* Active Workout */}
          {isWorkoutActive && currentWorkout && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Workout in Progress
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={pauseWorkout}>
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetWorkout}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${workoutProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{workoutProgress}%</div>
                    <p className="text-sm text-muted-foreground">Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workout Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workoutPlans.map(plan => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <Badge className={getDifficultyColor(plan.difficulty)}>
                      {plan.difficulty}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div>
                      <div className="text-sm font-bold text-blue-600">{plan.duration}min</div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-green-600">{plan.calories}</div>
                      <p className="text-xs text-muted-foreground">Calories</p>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-purple-600">{plan.exercises.length}</div>
                      <p className="text-xs text-muted-foreground">Exercises</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {plan.exercises.slice(0, 3).map(exercise => (
                      <div key={exercise.id} className="flex items-center justify-between text-sm">
                        <span>{exercise.name}</span>
                        <span className="text-muted-foreground">{exercise.sets}x{exercise.reps}</span>
                      </div>
                    ))}
                    {plan.exercises.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{plan.exercises.length - 3} more exercises</p>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => setCurrentWorkout(plan)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          {/* Meal Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealPlans.map(plan => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <Badge className={getGoalColor(plan.goal)}>
                      {plan.goal}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div>
                      <div className="text-sm font-bold text-blue-600">{plan.totalCalories}</div>
                      <p className="text-xs text-muted-foreground">Calories</p>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-green-600">{plan.macros.protein}g</div>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-purple-600">{plan.meals.length}</div>
                      <p className="text-xs text-muted-foreground">Meals</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {plan.meals.map(meal => (
                      <div key={meal.id} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{meal.type}</span>
                        <span className="text-muted-foreground">{meal.calories} cal</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => setCurrentMealPlan(plan)}
                  >
                    <Apple className="h-4 w-4 mr-2" />
                    View Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Nutrition Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Nutrition Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Protein Timing</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Consume 20-30g of protein within 30 minutes after your workout for optimal muscle recovery.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <h4 className="font-medium text-green-800 dark:text-green-200">Hydration</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Drink 500ml of water 2 hours before exercise and 250ml every 15 minutes during.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200">Meal Timing</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Eat a balanced meal 2-3 hours before exercise and a light snack 30 minutes before.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Recovery</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Include complex carbs and protein in your post-workout meal for optimal recovery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

