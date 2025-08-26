import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Heart, 
  Zap, 
  Moon, 
  Activity, 
  Book, 
  Disc3, 
  Users, 
  Target, 
  Star, 
  Coffee,
  AlertCircle,
  Plus,
  Lightbulb,
  LineChart,
  Calendar,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sun,
  CloudSun,
  Sparkles
} from 'lucide-react';

const EchoMedMentalWellness = () => {
  const [activeView, setActiveView] = useState<'journal' | 'insights' | 'trends'>('insights');
  const [currentMood, setCurrentMood] = useState(3);
  const [currentEnergy, setCurrentEnergy] = useState(3);
  const [currentSleep, setCurrentSleep] = useState(3);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [journalEntry, setJournalEntry] = useState('');

  const activities = [
    { name: 'Exercise', icon: Activity },
    { name: 'Meditation', icon: Brain },
    { name: 'Reading', icon: Book },
    { name: 'Music', icon: Disc3 },
    { name: 'Social', icon: Users },
    { name: 'Work', icon: Target },
    { name: 'Entertainment', icon: Star },
    { name: 'Coffee', icon: Coffee }
  ];

  const triggers = [
    { name: 'Work Stress', icon: AlertCircle },
    { name: 'Conflict', icon: AlertCircle },
    { name: 'Poor Sleep', icon: Moon },
    { name: 'Social Media', icon: AlertCircle },
    { name: 'News', icon: AlertCircle },
    { name: 'Financial Concerns', icon: AlertCircle }
  ];

  const getMoodColor = (mood: number) => {
    if (mood >= 4) return 'text-green-600';
    if (mood >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 4) return <Sun className="w-5 h-5" />;
    if (mood >= 3) return <CloudSun className="w-5 h-5" />;
    return <Moon className="w-5 h-5" />;
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const saveEntry = () => {
    // Reset form
    setCurrentMood(3);
    setCurrentEnergy(3);
    setCurrentSleep(3);
    setSelectedActivities([]);
    setSelectedTriggers([]);
    setJournalEntry('');
    setActiveView('insights');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mental Wellness
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Track your mental health journey</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Daily Journal
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Wellness Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood Rating */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  How are you feeling today?
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Very Low</span>
                    <span>Very High</span>
                  </div>
                  <Slider
                    value={[currentMood]}
                    onValueChange={(value) => setCurrentMood(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span className={getMoodColor(currentMood)}>
                      {getMoodIcon(currentMood)} {currentMood}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Energy Level */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Energy Level
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Very Low</span>
                    <span>Very High</span>
                  </div>
                  <Slider
                    value={[currentEnergy]}
                    onValueChange={(value) => setCurrentEnergy(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600">{currentEnergy}/5</span>
                  </div>
                </div>
              </div>

              {/* Sleep Quality */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  Sleep Quality (Last Night)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Very Poor</span>
                    <span>Excellent</span>
                  </div>
                  <Slider
                    value={[currentSleep]}
                    onValueChange={(value) => setCurrentSleep(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-600">{currentSleep}/5</span>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-4">
                <h3 className="font-semibold">What activities did you do today?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {activities.map((activity) => (
                    <Button
                      key={activity.name}
                      variant={selectedActivities.includes(activity.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleActivityToggle(activity.name)}
                      className="justify-start"
                    >
                      <activity.icon className="w-4 h-4 mr-2" />
                      {activity.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Triggers */}
              <div className="space-y-4">
                <h3 className="font-semibold">What affected your mood today?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {triggers.map((trigger) => (
                    <Button
                      key={trigger.name}
                      variant={selectedTriggers.includes(trigger.name) ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleTriggerToggle(trigger.name)}
                      className="justify-start"
                    >
                      <trigger.icon className="w-4 h-4 mr-2" />
                      {trigger.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Journal Entry */}
              <div className="space-y-4">
                <h3 className="font-semibold">Additional Notes (Optional)</h3>
                <Textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="How was your day? Any specific thoughts or feelings you'd like to record?"
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={saveEntry} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Mood Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Mood</span>
                  <span className="font-semibold">3.8/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trend</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Up</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sleep Quality</span>
                  <span className="font-semibold">4.2/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Energy Level</span>
                  <span className="font-semibold">3.5/5</span>
                </div>
              </CardContent>
            </Card>

            {/* Triggers & Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Top Triggers & Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Common Triggers</h4>
                  <div className="space-y-1">
                    {['Work Stress', 'Poor Sleep', 'Social Media'].map((trigger, index) => (
                      <div key={trigger} className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{trigger}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">Helpful Activities</h4>
                  <div className="space-y-1">
                    {['Exercise', 'Meditation', 'Reading'].map((activity, index) => (
                      <div key={activity} className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs bg-green-500">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold">Mindfulness</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Try 10 minutes of meditation daily to improve mood stability.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">Exercise</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Regular physical activity can boost your energy and mood.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold">Sleep Hygiene</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Maintain a consistent sleep schedule for better rest.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Mood Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Mood tracking data will appear here as you log entries</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { EchoMedMentalWellness };
