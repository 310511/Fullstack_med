import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  TrendingUp, 
  Heart, 
  Target, 
  Activity, 
  Droplets,
  Brain,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  Scale,
  Ruler,
  Calendar,
  User,
  Settings,
  Zap,
  Moon,
  Sun,
  Thermometer,
  Droplet,
  Coffee,
  BookOpen,
  HelpCircle,
  Download,
  Upload,
  Baby,
  Users,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';

interface BmiCalculatorProps {
  className?: string;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({ className }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [idealWeight, setIdealWeight] = useState('');
  const [tip, setTip] = useState('');
  const [calorieNeeds, setCalorieNeeds] = useState<number | null>(null);
  const [waterIntake, setWaterIntake] = useState<number | null>(null);
  const [goalWeight, setGoalWeight] = useState('');
  const [timeToGoal, setTimeToGoal] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');
  const [bodyComposition, setBodyComposition] = useState<any>(null);
  const [userProfile, setUserProfile] = useState({
    name: '',
    goal: 'maintain',
    medicalConditions: [],
    fitnessLevel: 'beginner'
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [animation, setAnimation] = useState(false);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [units, setUnits] = useState('metric');
  const [waistCircumference, setWaistCircumference] = useState('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [bloodPressure, setBloodPressure] = useState({ systolic: '', diastolic: '' });
  const [restingHeartRate, setRestingHeartRate] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [stressLevel, setStressLevel] = useState('moderate');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [nutritionPlan, setNutritionPlan] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [compareWith, setCompareWith] = useState('global');

  const tips = {
    nutrition: [
      'Drink at least 8 glasses of water daily for optimal hydration.',
      'Eat protein with every meal to help maintain muscle mass.',
      'Include colorful vegetables in your meals for essential nutrients.',
      'Consider meal prep on Sundays to maintain healthy eating habits.',
      'Eat mindfully - chew slowly and pay attention to hunger cues.',
      'Include omega-3 rich foods like salmon, walnuts, and chia seeds.',
      'Limit processed foods and focus on whole, natural ingredients.',
      'Try to eat 5-7 servings of fruits and vegetables daily.'
    ],
    exercise: [
      'Incorporate both cardio and strength training for balanced fitness.',
      'Try HIIT workouts for efficient calorie burning in less time.',
      'Take at least 8,000 steps daily for cardiovascular health.',
      'Schedule rest days to allow your muscles to recover properly.',
      'Start with bodyweight exercises if you\'re new to fitness.',
      'Consistency is key - aim for at least 30 minutes of activity daily.',
      'Mix up your routine to prevent boredom and plateaus.',
      'Focus on compound movements like squats, deadlifts, and push-ups.'
    ],
    lifestyle: [
      'Get 7-9 hours of quality sleep to support metabolism.',
      'Practice stress management techniques like meditation.',
      'Stand up and move for at least 5 minutes every hour.',
      'Track your food intake for a week to identify eating patterns.',
      'Maintain social connections for mental health support.',
      'Limit screen time before bed for better sleep quality.',
      'Practice gratitude daily to improve mental wellbeing.',
      'Set realistic, achievable goals to maintain motivation.'
    ],
    mental: [
      'Practice deep breathing exercises to reduce stress.',
      'Set aside time for hobbies and activities you enjoy.',
      'Consider mindfulness meditation for mental clarity.',
      'Don\'t compare your journey to others - focus on your progress.',
      'Celebrate small victories along your health journey.',
      'Seek professional help if you\'re struggling with mental health.'
    ]
  };

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const bmiCategories = [
    { name: 'Underweight', range: '< 18.5', color: '#64B5F6', healthRisk: 'Low to moderate' },
    { name: 'Normal', range: '18.5-24.9', color: '#66BB6A', healthRisk: 'Minimal' },
    { name: 'Overweight', range: '25-29.9', color: '#FFA726', healthRisk: 'Moderate' },
    { name: 'Obese Class I', range: '30-34.9', color: '#FF7043', healthRisk: 'High' },
    { name: 'Obese Class II', range: '35-39.9', color: '#EF5350', healthRisk: 'Very high' },
    { name: 'Obese Class III', range: '≥ 40', color: '#D32F2F', healthRisk: 'Extremely high' }
  ];

  const calculateBMI = () => {
    if (!weight || !height) return;

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (weightNum <= 0 || heightNum <= 0) return;

    const heightInMeters = units === 'metric' ? heightNum / 100 : heightNum * 0.0254;
    const weightInKg = units === 'metric' ? weightNum : weightNum * 0.453592;
    
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(bmiValue);

    // Calculate ideal weight range
    const minIdealWeight = 18.5 * (heightInMeters * heightInMeters);
    const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters);
    setIdealWeight(`${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} kg`);

    // Calculate calorie needs
    const bmr = gender === 'male' 
      ? 88.362 + (13.397 * weightInKg) + (4.799 * heightNum) - (5.677 * parseInt(age))
      : 447.593 + (9.247 * weightInKg) + (3.098 * heightNum) - (4.330 * parseInt(age));
    
    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];
    setCalorieNeeds(Math.round(tdee));

    // Calculate water intake
    const waterNeeds = weightInKg * 0.033;
    setWaterIntake(Math.round(waterNeeds * 1000));

    // Set message based on BMI
    if (bmiValue < 18.5) {
      setMessage('You are underweight. Consider increasing your caloric intake with healthy foods.');
      setTip(tips.nutrition[Math.floor(Math.random() * tips.nutrition.length)]);
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setMessage('Your BMI is in the healthy range. Keep up the good work!');
      setTip(tips.exercise[Math.floor(Math.random() * tips.exercise.length)]);
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setMessage('You are overweight. Focus on a balanced diet and regular exercise.');
      setTip(tips.lifestyle[Math.floor(Math.random() * tips.lifestyle.length)]);
    } else {
      setMessage('You are in the obese category. Consider consulting a healthcare professional.');
      setTip(tips.mental[Math.floor(Math.random() * tips.mental.length)]);
    }

    // Calculate health score
    calculateHealthScore(bmiValue, weightInKg, heightInMeters);
  };

  const calculateHealthScore = (bmiValue: number, weight: number, height: number) => {
    let score = 100;
    
    // BMI penalty
    if (bmiValue < 18.5) score -= 15;
    else if (bmiValue >= 25 && bmiValue < 30) score -= 10;
    else if (bmiValue >= 30) score -= 25;

    // Age factor
    const ageNum = parseInt(age);
    if (ageNum > 50) score -= 5;
    if (ageNum > 65) score -= 10;

    // Activity level bonus
    if (activityLevel === 'veryActive') score += 10;
    else if (activityLevel === 'active') score += 5;

    setHealthScore(Math.max(0, Math.min(100, score)));
  };

  const getBmiCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return bmiCategories[0];
    if (bmiValue < 25) return bmiCategories[1];
    if (bmiValue < 30) return bmiCategories[2];
    if (bmiValue < 35) return bmiCategories[3];
    if (bmiValue < 40) return bmiCategories[4];
    return bmiCategories[5];
  };

  const bmiCategory = bmi ? getBmiCategory(bmi) : null;

  // Sample data for charts
  const weightHistoryData = [
    { date: 'Jan 1', weight: 70 },
    { date: 'Jan 8', weight: 69.5 },
    { date: 'Jan 15', weight: 69 },
    { date: 'Jan 22', weight: 68.5 },
    { date: 'Jan 29', weight: 68 }
  ];

  const bodyCompositionData = [
    { name: 'Muscle Mass', value: 45, color: '#4CAF50' },
    { name: 'Body Fat', value: 25, color: '#FF9800' },
    { name: 'Bone Mass', value: 15, color: '#2196F3' },
    { name: 'Water', value: 15, color: '#00BCD4' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced BMI Calculator
        </h1>
        <p className="text-muted-foreground">Comprehensive health analysis and personalized recommendations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="analysis">Health Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="tracking">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Health Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="units">Units</Label>
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg/cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lbs/in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight ({units === 'metric' ? 'kg' : 'lbs'})</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={units === 'metric' ? '70' : '154'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height ({units === 'metric' ? 'cm' : 'in'})</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder={units === 'metric' ? '170' : '67'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="activity">Activity Level</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Lightly Active</SelectItem>
                        <SelectItem value="moderate">Moderately Active</SelectItem>
                        <SelectItem value="active">Very Active</SelectItem>
                        <SelectItem value="veryActive">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateBMI} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                  Calculate BMI & Health Metrics
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bmi ? (
                  <>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">{bmi.toFixed(1)}</div>
                      <div className="text-lg font-medium">Your BMI</div>
                      <Badge 
                        className="mt-2"
                        style={{ backgroundColor: bmiCategory?.color, color: 'white' }}
                      >
                        {bmiCategory?.name}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Health Risk:</span>
                        <span className="font-medium">{bmiCategory?.healthRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ideal Weight Range:</span>
                        <span className="font-medium">{idealWeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Calories:</span>
                        <span className="font-medium">{calorieNeeds?.toLocaleString()} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Intake:</span>
                        <span className="font-medium">{waterIntake}ml</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm">{message}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">{tip}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Enter your information and click calculate to see your results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BMI Categories Chart */}
            <Card>
              <CardHeader>
                <CardTitle>BMI Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bmiCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.range}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{category.healthRisk}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Score */}
            <Card>
              <CardHeader>
                <CardTitle>Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                {healthScore !== null ? (
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <Progress value={healthScore} className="h-4" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{healthScore}/100</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {healthScore >= 80 ? 'Excellent health score!' :
                         healthScore >= 60 ? 'Good health score' :
                         healthScore >= 40 ? 'Fair health score' :
                         'Health score needs improvement'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Calculate BMI to see your health score
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(tips).map(([category, tipList]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {category === 'nutrition' && <Droplets className="h-5 w-5" />}
                    {category === 'exercise' && <Activity className="h-5 w-5" />}
                    {category === 'lifestyle' && <Heart className="h-5 w-5" />}
                    {category === 'mental' && <Brain className="h-5 w-5" />}
                    {category} Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tipList.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <p className="text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight History Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weightHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Body Composition */}
            <Card>
              <CardHeader>
                <CardTitle>Body Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={bodyCompositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {bodyCompositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {bodyCompositionData.map((item, index) => (
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

