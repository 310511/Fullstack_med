import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FitnessDashboard } from '@/components/fitness/FitnessDashboard';
import { BmiCalculator } from '@/components/health/BmiCalculator';
import { PeriodTracker } from '@/components/health/PeriodTracker';
import { 
  Activity, 
  Heart, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Dumbbell,
  Calculator,
  Users
} from 'lucide-react';

export const HealthAnalytics: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Health Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">Comprehensive health monitoring and analytics platform</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold text-green-600">85/100</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Days</p>
                <p className="text-2xl font-bold text-blue-600">5/7</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-bold text-red-600">72 BPM</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">BMI Status</p>
                <p className="text-2xl font-bold text-purple-600">Normal</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="fitness" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fitness" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Fitness
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fitness" className="space-y-4">
          <FitnessDashboard />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <BmiCalculator />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <PeriodTracker />
        </TabsContent>
      </Tabs>

      {/* Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Health Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Improving Fitness</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Your workout consistency is improving</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">Healthy BMI</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Your BMI is within the healthy range</p>
                </div>
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-200">Regular Sleep</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">You're maintaining good sleep patterns</p>
                </div>
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Increase Water Intake</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  You're drinking 60% of your daily water goal. Try to increase by 2-3 glasses.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
                <p className="font-medium text-indigo-800 dark:text-indigo-200">Add Strength Training</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                  Consider adding 2-3 strength training sessions per week for better results.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <p className="font-medium text-emerald-800 dark:text-emerald-200">Great Progress!</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  You've achieved 85% of your monthly fitness goals. Keep it up!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

