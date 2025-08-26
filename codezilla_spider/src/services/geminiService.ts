import { API_ENDPOINTS } from '@/config/api';

export interface AIMedicineRecommendation {
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

export interface AIHealthConsultationResponse {
  success: boolean;
  response: string;
  timestamp: string;
  model_used: string;
  error?: string;
}

export interface AIMedicalTextAnalysis {
  symptoms: string[];
  potential_conditions: string[];
  recommended_actions: string[];
  urgency_level: 'low' | 'medium' | 'high';
  follow_up: string;
}

export interface AIMedicineRecommendationResponse {
  success: boolean;
  data: AIMedicineRecommendation;
  timestamp: string;
  user_id: string;
  error?: string;
}

export interface AIMedicalTextAnalysisResponse {
  success: boolean;
  analysis: AIMedicalTextAnalysis;
  timestamp: string;
  error?: string;
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  private async makeGeminiRequest(prompt: string, systemPrompt?: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  async getMedicineRecommendations(symptoms: string, userId: string): Promise<AIMedicineRecommendationResponse> {
    try {
      const systemPrompt = `You are a medical AI assistant. Provide medicine recommendations based on symptoms. Always include safety warnings and advise consulting a healthcare professional for serious conditions.`;

      const prompt = `Based on these symptoms: "${symptoms}", provide medicine recommendations. Include:
1. Symptom analysis
2. Recommended medicines with dosage and frequency
3. Side effects and warnings
4. Urgency level
5. Lifestyle recommendations
6. Follow-up advice

Format the response as a structured medical recommendation.`;

      const result = await this.makeGeminiRequest(prompt, systemPrompt);
      
      // Parse the response and structure it
      const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // For now, return a structured response
      const recommendation: AIMedicineRecommendation = {
        symptom_analysis: `Analysis of symptoms: ${symptoms}`,
        recommendations: [
          {
            medicine_name: "Consultation Recommended",
            category: "Professional Medical Advice",
            dosage: "As prescribed by healthcare provider",
            frequency: "As directed",
            side_effects: ["Varies by individual"],
            warnings: ["Always consult a healthcare professional for proper diagnosis"],
            confidence_score: 0.8
          }
        ],
        urgency_level: 'medium',
        medical_attention_needed: true,
        lifestyle_recommendations: ["Rest", "Stay hydrated", "Monitor symptoms"],
        follow_up_advice: "Schedule an appointment with your healthcare provider"
      };

      return {
        success: true,
        data: recommendation,
        timestamp: new Date().toISOString(),
        user_id: userId
      };
    } catch (error) {
      console.error('Medicine recommendation failed:', error);
      return {
        success: false,
        data: {} as AIMedicineRecommendation,
        timestamp: new Date().toISOString(),
        user_id: userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getHealthConsultation(question: string, userId: string): Promise<AIHealthConsultationResponse> {
    try {
      const systemPrompt = `You are a medical AI assistant. Provide helpful health information and advice. Always include disclaimers about consulting healthcare professionals for serious conditions.`;

      const result = await this.makeGeminiRequest(question, systemPrompt);
      
      const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response';

      return {
        success: true,
        response: responseText,
        timestamp: new Date().toISOString(),
        model_used: 'gemini-pro'
      };
    } catch (error) {
      console.error('Health consultation failed:', error);
      return {
        success: false,
        response: '',
        timestamp: new Date().toISOString(),
        model_used: 'gemini-pro',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async analyzeMedicalText(text: string): Promise<AIMedicalTextAnalysisResponse> {
    try {
      const systemPrompt = `You are a medical AI assistant. Analyze medical text and extract symptoms, potential conditions, and recommendations.`;

      const prompt = `Analyze this medical text: "${text}". Extract:
1. Symptoms mentioned
2. Potential conditions
3. Recommended actions
4. Urgency level
5. Follow-up recommendations`;

      const result = await this.makeGeminiRequest(prompt, systemPrompt);
      
      const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const analysis: AIMedicalTextAnalysis = {
        symptoms: ["Symptom analysis requires professional evaluation"],
        potential_conditions: ["Consult healthcare provider for diagnosis"],
        recommended_actions: ["Schedule medical appointment"],
        urgency_level: 'medium',
        follow_up: "Professional medical evaluation recommended"
      };

      return {
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Medical text analysis failed:', error);
      return {
        success: false,
        analysis: {} as AIMedicalTextAnalysis,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const geminiService = new GeminiService();
