import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Heart, 
  Activity, 
  Target, 
  TrendingUp, 
  Disc3,
  Zap,
  CheckCircle,
  Info
} from 'lucide-react';

interface MentalHealthDashboardProps {
  className?: string;
}

export const MentalHealthDashboard: React.FC<MentalHealthDashboardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [wellbeingScore, setWellbeingScore] = useState(75);
  const [dailyTasks, setDailyTasks] = useState([
    { id: '1', task: 'Do 10 deep breathing exercises', completed: true },
    { id: '2', task: 'Take a 5-minute walk outside', completed: false },
    { id: '3', task: 'Drink 2 glasses of water', completed: false }
  ]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResponses, setQuizResponses] = useState({
    anxiety: 3,
    mood: 3,
    sleep: 3,
    social: 3,
    stress: 3
  });
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleQuizSubmit = () => {
    const newScore = Math.round(
      ((5 - quizResponses.anxiety) * 0.25 + 
       (5 - quizResponses.mood) * 0.25 + 
       quizResponses.sleep * 0.2 + 
       quizResponses.social * 0.15 + 
       (5 - quizResponses.stress) * 0.15) * 20
    );
    setWellbeingScore(newScore);
    setShowQuiz(false);
    
    // Generate recommendations
    const recs: string[] = [];
    if (quizResponses.anxiety >= 4) recs.push('Practice deep breathing exercises');
    if (quizResponses.mood >= 4) recs.push('Increase physical activity');
    if (quizResponses.sleep <= 2) recs.push('Establish a consistent sleep schedule');
    if (quizResponses.social <= 2) recs.push('Reach out to friends or family');
    if (quizResponses.stress >= 4) recs.push('Try mindfulness meditation');
    
    setRecommendations(recs);
  };

  const generateTask = () => {
    const tasks = [
      'Do 10 push-ups',
      'Take 5 deep breaths',
      'Stretch for 2 minutes',
      'Drink a glass of water',
      'Step outside for fresh air'
    ];
    const newTask = tasks[Math.floor(Math.random() * tasks.length)];
    setDailyTasks(prev => [...prev, { id: Date.now().toString(), task: newTask, completed: false }]);
  };

  const toggleTask = (taskId: string) => {
    setDailyTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mental Health Dashboard
        </h1>
        <p className="text-muted-foreground">Track your wellbeing and build healthy habits</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{wellbeingScore}</div>
            <p className="text-sm text-muted-foreground">Wellbeing Score</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {dailyTasks.filter(t => t.completed).length}
            </div>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{recommendations.length}</div>
            <p className="text-sm text-muted-foreground">AI Recommendations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="tasks">Daily Tasks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Wellbeing Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Score</span>
                    <Badge variant={wellbeingScore >= 70 ? 'default' : 'destructive'}>
                      {wellbeingScore}/100
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${wellbeingScore}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => setShowQuiz(true)}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Take Wellbeing Assessment
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={generateTask}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Generate Daily Task
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                >
                                  <Disc3 className="h-4 w-4 mr-2" />
                Get Music Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          {showQuiz ? (
            <Card>
              <CardHeader>
                <CardTitle>Wellbeing Assessment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Rate each area on a scale of 1-5 (1 = Never/Very Poor, 5 = Very Often/Very Good)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>How often do you feel anxious or worried?</Label>
                    <Select value={quizResponses.anxiety.toString()} onValueChange={(value) => setQuizResponses(prev => ({ ...prev, anxiety: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Never</SelectItem>
                        <SelectItem value="2">2 - Rarely</SelectItem>
                        <SelectItem value="3">3 - Sometimes</SelectItem>
                        <SelectItem value="4">4 - Often</SelectItem>
                        <SelectItem value="5">5 - Very Often</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How often do you feel down or depressed?</Label>
                    <Select value={quizResponses.mood.toString()} onValueChange={(value) => setQuizResponses(prev => ({ ...prev, mood: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Never</SelectItem>
                        <SelectItem value="2">2 - Rarely</SelectItem>
                        <SelectItem value="3">3 - Sometimes</SelectItem>
                        <SelectItem value="4">4 - Often</SelectItem>
                        <SelectItem value="5">5 - Very Often</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How would you rate your sleep quality?</Label>
                    <Select value={quizResponses.sleep.toString()} onValueChange={(value) => setQuizResponses(prev => ({ ...prev, sleep: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Poor</SelectItem>
                        <SelectItem value="2">2 - Poor</SelectItem>
                        <SelectItem value="3">3 - Fair</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="5">5 - Very Good</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How would you rate your social support?</Label>
                    <Select value={quizResponses.social.toString()} onValueChange={(value) => setQuizResponses(prev => ({ ...prev, social: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Poor</SelectItem>
                        <SelectItem value="2">2 - Poor</SelectItem>
                        <SelectItem value="3">3 - Fair</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="5">5 - Very Good</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How would you rate your stress level?</Label>
                    <Select value={quizResponses.stress.toString()} onValueChange={(value) => setQuizResponses(prev => ({ ...prev, stress: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Low</SelectItem>
                        <SelectItem value="2">2 - Low</SelectItem>
                        <SelectItem value="3">3 - Moderate</SelectItem>
                        <SelectItem value="4">4 - High</SelectItem>
                        <SelectItem value="5">5 - Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleQuizSubmit} className="flex-1">
                    Submit Assessment
                  </Button>
                  <Button variant="outline" onClick={() => setShowQuiz(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              <Button onClick={() => setShowQuiz(true)}>
                <Brain className="h-4 w-4 mr-2" />
                Start Wellbeing Assessment
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Daily Tasks
                </span>
                <Button size="sm" onClick={generateTask}>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Task
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="rounded"
                      />
                      <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                        {task.task}
                      </span>
                    </div>
                    {task.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <div key={index} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">{rec}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Take the wellbeing assessment to get personalized recommendations
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
