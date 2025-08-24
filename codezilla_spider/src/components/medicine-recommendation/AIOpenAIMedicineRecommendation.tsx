import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Package, 
  Loader2,
  Stethoscope,
  Activity,
  TrendingUp,
  AlertCircle,
  Brain,
  Sparkles,
  Zap,
  Heart,
  Shield,
  Target,
  ArrowRight,
  Plus,
  Minus,
  Star,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Settings,
  Search,
  Filter,
  RefreshCw,
  Lightbulb,
  Info,
  X,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Bot,
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

export function AIOpenAIMedicineRecommendation() {
  const [symptoms, setSymptoms] = useState('');
  const [recommendations, setRecommendations] = useState<AIMedicineRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleGetRecommendations = async () => {
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysisProgress(0);
    setRecommendations(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

              const response = await geminiService.getMedicineRecommendations(symptoms, 'user-' + Date.now());
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (response.success) {
        setRecommendations(response.data);
      } else {
        setError(response.error || 'Failed to get AI recommendations');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error getting AI recommendations:', err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setAnalysisProgress(0), 1000);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      default: return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (score >= 0.6) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Medicine Recommendations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Powered by advanced AI for personalized medicine suggestions
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            Describe Your Symptoms
          </CardTitle>
          <CardDescription>
            Provide detailed information about your symptoms for AI-powered medicine recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms in detail (e.g., 'I have a severe headache with nausea and sensitivity to light for the past 2 days')"
            className="min-h-[120px] resize-none"
          />
          <Button
            onClick={handleGetRecommendations}
            disabled={!symptoms.trim() || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI Analysis Progress</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-xs text-gray-500">
                Analyzing symptoms and generating personalized recommendations...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* AI Recommendations */}
      {recommendations && (
        <div className="space-y-6">
          {/* Symptom Analysis */}
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Brain className="w-5 h-5" />
                AI Symptom Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {recommendations.symptom_analysis}
              </p>
            </CardContent>
          </Card>

          {/* Urgency Level */}
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Urgency Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className={`${getUrgencyColor(recommendations.urgency_level)} text-white`}>
                  {recommendations.urgency_level.toUpperCase()} URGENCY
                </Badge>
                {recommendations.medical_attention_needed && (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Medical Attention Required
                  </Badge>
                )}
              </div>
              {recommendations.medical_attention_needed && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Based on your symptoms, immediate medical attention is recommended. 
                    Please consult with a healthcare professional as soon as possible.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Medicine Recommendations */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Pill className="w-5 h-5" />
                AI-Recommended Medicines
              </CardTitle>
              <CardDescription>
                Personalized medicine recommendations based on your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.recommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{rec.medicine_name}</h4>
                        <Badge variant="outline" className="mt-1">
                          {rec.category}
                        </Badge>
                      </div>
                      <Badge className={`${getConfidenceColor(rec.confidence_score)} text-white`}>
                        {Math.round(rec.confidence_score * 100)}% Confidence
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Dosage & Frequency
                        </h5>
                        <p className="text-sm">{rec.dosage} - {rec.frequency}</p>
                      </div>
                    </div>

                    {rec.side_effects.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Common Side Effects
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {rec.side_effects.map((effect, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {rec.warnings.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-red-600 dark:text-red-400 mb-1">
                          Important Warnings
                        </h5>
                        <div className="space-y-1">
                          {rec.warnings.map((warning, idx) => (
                            <p key={idx} className="text-sm text-red-600 dark:text-red-400">
                              • {warning}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Recommendations */}
          {recommendations.lifestyle_recommendations.length > 0 && (
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <Heart className="w-5 h-5" />
                  Lifestyle Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendations.lifestyle_recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Follow-up Advice */}
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Clock className="w-5 h-5" />
                Follow-up Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                {recommendations.follow_up_advice}
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> These AI-generated recommendations are for informational purposes only. 
              Always consult with a qualified healthcare professional before taking any medication. 
              The AI does not replace professional medical advice, diagnosis, or treatment.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
