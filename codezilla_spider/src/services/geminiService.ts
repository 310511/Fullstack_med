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

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini Service Error:', error);
      throw error;
    }
  }

  async getMedicineRecommendations(
    symptoms: string,
    userId: string = 'default-user'
  ): Promise<AIMedicineRecommendationResponse> {
    try {
      const systemPrompt = `You are a medical AI assistant. Provide medicine recommendations based on symptoms. 
      Always include disclaimers that this is not medical advice and users should consult healthcare professionals.
      Format your response as a JSON object with the following structure:
      {
        "symptom_analysis": "detailed analysis of symptoms",
        "recommendations": [
          {
            "medicine_name": "medicine name",
            "category": "category",
            "dosage": "dosage info",
            "frequency": "how often to take",
            "side_effects": ["side effect 1", "side effect 2"],
            "warnings": ["warning 1", "warning 2"],
            "confidence_score": 0.85
          }
        ],
        "urgency_level": "low|medium|high",
        "medical_attention_needed": true/false,
        "lifestyle_recommendations": ["recommendation 1", "recommendation 2"],
        "follow_up_advice": "follow up advice"
      }`;

      const prompt = `Analyze these symptoms and provide medicine recommendations: ${symptoms}`;
      
      const response = await this.makeGeminiRequest(prompt, systemPrompt);
      const parsedResponse = JSON.parse(response);

      return {
        success: true,
        data: parsedResponse,
        timestamp: new Date().toISOString(),
        user_id: userId,
      };
    } catch (error) {
      return {
        success: false,
        data: {} as AIMedicineRecommendation,
        timestamp: new Date().toISOString(),
        user_id: userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getHealthConsultation(
    message: string,
    userId: string = 'default-user',
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<AIHealthConsultationResponse> {
    try {
      const systemPrompt = `You are a medical AI assistant. Provide helpful health consultation while always reminding users that this is not medical advice and they should consult healthcare professionals for serious concerns.`;

      let fullPrompt = message;
      if (conversationHistory && conversationHistory.length > 0) {
        const historyText = conversationHistory
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        fullPrompt = `Previous conversation:\n${historyText}\n\nCurrent message: ${message}`;
      }

      const response = await this.makeGeminiRequest(fullPrompt, systemPrompt);

      return {
        success: true,
        response: response,
        timestamp: new Date().toISOString(),
        model_used: 'gemini-pro',
      };
    } catch (error) {
      return {
        success: false,
        response: '',
        timestamp: new Date().toISOString(),
        model_used: 'gemini-pro',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async analyzeMedicalText(
    text: string,
    userId?: string
  ): Promise<AIMedicalTextAnalysisResponse> {
    try {
      const systemPrompt = `You are a medical AI assistant. Analyze medical text and extract symptoms, potential conditions, and recommendations. 
      Format your response as a JSON object with the following structure:
      {
        "symptoms": ["symptom 1", "symptom 2"],
        "potential_conditions": ["condition 1", "condition 2"],
        "recommended_actions": ["action 1", "action 2"],
        "urgency_level": "low|medium|high",
        "follow_up": "follow up advice"
      }`;

      const prompt = `Analyze this medical text: ${text}`;
      
      const response = await this.makeGeminiRequest(prompt, systemPrompt);
      const parsedResponse = JSON.parse(response);

      return {
        success: true,
        analysis: parsedResponse,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        analysis: {} as AIMedicalTextAnalysis,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const geminiService = new GeminiService();
