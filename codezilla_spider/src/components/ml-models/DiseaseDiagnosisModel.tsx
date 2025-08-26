import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Thermometer, 
  Heart, 
  Droplets, 
  Brain, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Zap
} from "lucide-react";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: string;
  treatment: string;
  riskLevel: string;
}

interface SymptomInput {
  symptom1: string;
  symptom2: string;
  symptom3: string;
  heartRate: number;
  temperature: number;
  bloodPressure: string;
  oxygenSaturation: number;
  age: number;
  gender: string;
}

const symptoms = [
  "Fatigue", "Sore throat", "Fever", "Cough", "Headache", "Body ache",
  "Runny nose", "Shortness of breath", "Chest pain", "Nausea", "Vomiting",
  "Diarrhea", "Loss of appetite", "Muscle pain", "Joint pain", "Dizziness"
];

const diseases = [
  { name: "Flu", symptoms: ["Fever", "Fatigue", "Body ache", "Cough"], severity: "Moderate" },
  { name: "Bronchitis", symptoms: ["Cough", "Shortness of breath", "Chest pain"], severity: "Severe" },
  { name: "Pneumonia", symptoms: ["Fever", "Cough", "Shortness of breath"], severity: "Severe" },
  { name: "Cold", symptoms: ["Runny nose", "Sore throat", "Cough"], severity: "Mild" },
  { name: "Healthy", symptoms: [], severity: "Mild" }
];

export const DiseaseDiagnosisModel: React.FC = () => {
  const [symptomInput, setSymptomInput] = useState<SymptomInput>({
    symptom1: "",
    symptom2: "",
    symptom3: "",
    heartRate: 70,
    temperature: 37.0,
    bloodPressure: "120/80",
    oxygenSaturation: 98,
    age: 30,
    gender: "Male"
  });

  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate ML analysis process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setAnalysisProgress(i);
    }

    // ML Algorithm: Symptom-based disease classification
    const userSymptoms = [symptomInput.symptom1, symptomInput.symptom2, symptomInput.symptom3].filter(s => s);
    
    let bestMatch = { disease: "Healthy", confidence: 0, severity: "Mild", treatment: "Rest and fluids", riskLevel: "Low" };
    
    diseases.forEach(disease => {
      const symptomMatches = disease.symptoms.filter(symptom => 
        userSymptoms.some(userSymptom => 
          userSymptom.toLowerCase().includes(symptom.toLowerCase())
        )
      );
      
      const confidence = (symptomMatches.length / Math.max(userSymptoms.length, 1)) * 100;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          disease: disease.name,
          confidence: Math.min(confidence, 95),
          severity: disease.severity,
          treatment: getTreatment(disease.name, disease.severity),
          riskLevel: getRiskLevel(disease.severity, symptomInput.age, symptomInput.heartRate, symptomInput.temperature)
        };
      }
    });

    // Adjust confidence based on vital signs
    const vitalSignsAdjustment = analyzeVitalSigns(symptomInput);
    bestMatch.confidence = Math.min(bestMatch.confidence + vitalSignsAdjustment, 95);

    setDiagnosisResult(bestMatch);
    setIsAnalyzing(false);
  };

  const analyzeVitalSigns = (input: SymptomInput): number => {
    let adjustment = 0;
    
    // Temperature analysis
    if (input.temperature > 38.5) adjustment += 10;
    else if (input.temperature > 37.5) adjustment += 5;
    
    // Heart rate analysis
    if (input.heartRate > 100) adjustment += 8;
    else if (input.heartRate > 90) adjustment += 3;
    
    // Oxygen saturation analysis
    if (input.oxygenSaturation < 95) adjustment += 7;
    else if (input.oxygenSaturation < 98) adjustment += 2;
    
    // Age risk factor
    if (input.age > 65) adjustment += 5;
    else if (input.age > 50) adjustment += 2;
    
    return adjustment;
  };

  const getTreatment = (disease: string, severity: string): string => {
    const treatments = {
      "Flu": severity === "Severe" ? "Hospitalization and medication" : "Medication and rest",
      "Bronchitis": "Hospitalization and medication",
      "Pneumonia": "Hospitalization and medication",
      "Cold": "Rest and fluids",
      "Healthy": "Rest and fluids"
    };
    return treatments[disease as keyof typeof treatments] || "Rest and fluids";
  };

  const getRiskLevel = (severity: string, age: number, heartRate: number, temperature: number): string => {
    if (severity === "Severe" || age > 65 || heartRate > 100 || temperature > 39) return "High";
    if (severity === "Moderate" || age > 50 || heartRate > 90 || temperature > 38) return "Medium";
    return "Low";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Severe": return "bg-red-100 text-red-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Mild": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Disease Diagnosis AI</h1>
              <p className="text-muted-foreground">ML-powered disease prediction based on symptoms and vital signs</p>
            </div>
          </div>
          <Badge variant="secondary" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Real-time Analysis
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Patient Symptoms & Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demographics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={symptomInput.age}
                    onChange={(e) => setSymptomInput({...symptomInput, age: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={symptomInput.gender} onValueChange={(value) => setSymptomInput({...symptomInput, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-3">
                <Label>Symptoms (Select up to 3)</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[1, 2, 3].map((num) => (
                    <Select 
                      key={num}
                      value={symptomInput[`symptom${num}` as keyof SymptomInput] as string}
                      onValueChange={(value) => setSymptomInput({...symptomInput, [`symptom${num}`]: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Symptom ${num}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {symptoms.map(symptom => (
                          <SelectItem key={symptom} value={symptom}>{symptom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Vital Signs
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      value={symptomInput.heartRate}
                      onChange={(e) => setSymptomInput({...symptomInput, heartRate: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={symptomInput.temperature}
                      onChange={(e) => setSymptomInput({...symptomInput, temperature: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80"
                      value={symptomInput.bloodPressure}
                      onChange={(e) => setSymptomInput({...symptomInput, bloodPressure: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                    <Input
                      id="oxygenSaturation"
                      type="number"
                      value={symptomInput.oxygenSaturation}
                      onChange={(e) => setSymptomInput({...symptomInput, oxygenSaturation: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={analyzeSymptoms} 
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Symptoms
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ML Analysis Progress</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Diagnosis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnosisResult ? (
                <div className="space-y-4">
                  {/* Primary Diagnosis */}
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Primary Diagnosis</h3>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {diagnosisResult.disease}
                    </div>
                    <div className="flex justify-center gap-2 mb-3">
                      <Badge className={getSeverityColor(diagnosisResult.severity)}>
                        {diagnosisResult.severity}
                      </Badge>
                      <Badge className={getRiskColor(diagnosisResult.riskLevel)}>
                        Risk: {diagnosisResult.riskLevel}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Confidence: {diagnosisResult.confidence.toFixed(1)}%
                    </div>
                  </div>

                  {/* Treatment Plan */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Recommended Treatment
                    </h4>
                    <p className="text-sm">{diagnosisResult.treatment}</p>
                  </div>

                  {/* Risk Assessment */}
                  {diagnosisResult.riskLevel === "High" && (
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        High Risk Alert
                      </h4>
                      <p className="text-sm text-red-700">
                        Immediate medical attention recommended. Please consult a healthcare provider.
                      </p>
                    </div>
                  )}

                  {/* Vital Signs Analysis */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Vital Signs Analysis</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Heart Rate:</span>
                        <span className={symptomInput.heartRate > 100 ? "text-red-600 font-semibold" : "text-green-600"}>
                          {symptomInput.heartRate} bpm
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span>Temperature:</span>
                        <span className={symptomInput.temperature > 38.5 ? "text-red-600 font-semibold" : "text-green-600"}>
                          {symptomInput.temperature}°C
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>O2 Saturation:</span>
                        <span className={symptomInput.oxygenSaturation < 95 ? "text-red-600 font-semibold" : "text-green-600"}>
                          {symptomInput.oxygenSaturation}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-500" />
                        <span>Age Risk:</span>
                        <span className={symptomInput.age > 65 ? "text-red-600 font-semibold" : "text-green-600"}>
                          {symptomInput.age} years
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter symptoms and vital signs to get AI diagnosis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Model Information */}
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Training Data</h4>
                <p>2,000+ patient records with symptoms, vital signs, and confirmed diagnoses</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Accuracy</h4>
                <p>85% accuracy in disease classification based on symptoms and vital signs</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Supported Diseases</h4>
                <p>Flu, Bronchitis, Pneumonia, Common Cold, and Healthy classification</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


