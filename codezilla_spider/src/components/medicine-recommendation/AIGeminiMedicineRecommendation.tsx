import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  User
} from 'lucide-react';
import { geminiService, AIMedicineRecommendationResponse } from '@/services/geminiService';

interface AIMedicineRecommendation {
  symptom_analysis: string;
  recommendations: Array<{
    medicine_name: string;
    category: string;
    dosage: string;
    frequency: string;
    side_effects: string[];
    warnings: string[];
    confidence_score: number;
  }>;
  urgency_level: 'low' | 'medium' | 'high';
  medical_attention_needed: boolean;
  lifestyle_recommendations: string[];
  follow_up_advice: string;
}

export function AIGeminiMedicineRecommendation() {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recommendation, setRecommendation] = useState<AIMedicineRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9));

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setProgress(0);
    setError(null);
    setRecommendation(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await geminiService.getMedicineRecommendations(symptoms, 'user-' + Date.now());
      
      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        setRecommendation(response.data);
      } else {
        setError(response.error || 'Failed to get recommendations');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('An error occurred while processing your request');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          MedCHAIN🫀 AI Medicine Recommendation
        </h1>
        <p className="text-muted-foreground">
          Powered by Google Gemini AI - Get personalized medicine recommendations based on your symptoms
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Symptom Analysis
          </CardTitle>
          <CardDescription>
            Describe your symptoms in detail to receive AI-powered medicine recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Describe your symptoms</Label>
              <Textarea
                id="symptoms"
                placeholder="e.g., I have a severe headache with nausea and sensitivity to light for the past 2 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading || !symptoms.trim()}>
              {isLoading ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Get Recommendations
                </>
              )}
            </Button>
          </form>

          {isLoading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Analyzing symptoms...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendation && (
        <div className="space-y-6">
          {/* Symptom Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Symptom Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{recommendation.symptom_analysis}</p>
            </CardContent>
          </Card>

          {/* Urgency Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Urgency Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getUrgencyColor(recommendation.urgency_level)}>
                  {recommendation.urgency_level.toUpperCase()} URGENCY
                </Badge>
                {recommendation.medical_attention_needed && (
                  <Badge variant="destructive">MEDICAL ATTENTION NEEDED</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {recommendation.medical_attention_needed 
                  ? "Please consult a healthcare professional immediately."
                  : "Monitor your symptoms and consult a doctor if they worsen."
                }
              </p>
            </CardContent>
          </Card>

          {/* Medicine Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Recommended Medicines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendation.recommendations.map((med, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{med.medicine_name}</h4>
                          <p className="text-sm text-muted-foreground">{med.category}</p>
                        </div>
                        <Badge className={getConfidenceColor(med.confidence_score)}>
                          {Math.round(med.confidence_score * 100)}% Confidence
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Dosage & Frequency</h5>
                          <div className="space-y-1 text-sm">
                            <p><strong>Dosage:</strong> {med.dosage}</p>
                            <p><strong>Frequency:</strong> {med.frequency}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Side Effects</h5>
                          <div className="space-y-1">
                            {med.side_effects.map((effect, idx) => (
                              <Badge key={idx} variant="outline" className="mr-1 mb-1">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {med.warnings.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2 text-red-600">Warnings</h5>
                          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                            {med.warnings.map((warning, idx) => (
                              <li key={idx}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Recommendations */}
          {recommendation.lifestyle_recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Lifestyle Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendation.lifestyle_recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Follow-up Advice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Follow-up Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{recommendation.follow_up_advice}</p>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important Disclaimer:</strong> This AI-powered recommendation system is for informational purposes only. 
              It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified 
              healthcare provider before taking any medication or making health decisions. The recommendations provided are 
              based on general information and may not be appropriate for your specific situation.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
