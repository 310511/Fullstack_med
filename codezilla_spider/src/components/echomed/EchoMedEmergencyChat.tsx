import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  AlertTriangle,
  Loader2,
  MessageCircle,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { geminiService, AIHealthConsultationResponse } from '@/services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Emergency responses for offline mode
const EMERGENCY_RESPONSES: Record<string, string> = {
  "default": "I'm Dr. Echo, your health assistant. I'm currently operating in emergency mode with limited responses. I can answer basic health questions, but please consult a healthcare professional for medical advice.",
  "hello": "Hello! I'm Dr. Echo, your EchoMed AI health assistant. I'm currently in emergency mode, but I'll do my best to help you.",
  "hi": "Hi there! I'm Dr. Echo. I'm currently using a limited response system, but I'll try to assist you.",
  "headache": "Headaches can be caused by stress, dehydration, lack of sleep, or eyestrain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If you experience severe or recurring headaches, please consult a healthcare professional.",
  "cold": "Common cold symptoms include runny nose, sore throat, cough, and mild fever. Rest, staying hydrated, and over-the-counter medications can help manage symptoms. If symptoms persist for more than 10 days or become severe, consult a healthcare professional.",
  "fever": "Fever is often a sign that your body is fighting an infection. Rest, staying hydrated, and taking over-the-counter fever reducers can help. If your fever is high (above 103°F/39.4°C), persists for more than three days, or is accompanied by severe symptoms, seek medical attention.",
  "sleep": "Good sleep hygiene includes maintaining a regular sleep schedule, creating a comfortable sleep environment, limiting screen time before bed, and avoiding caffeine and large meals close to bedtime. Adults typically need 7-9 hours of sleep per night.",
  "diet": "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's important to limit processed foods, added sugars, and excessive salt. Staying hydrated by drinking plenty of water is also essential for good health.",
  "exercise": "Regular physical activity is important for maintaining good health. Adults should aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity per week, along with muscle-strengthening activities twice a week.",
  "stress": "Stress management techniques include deep breathing exercises, meditation, physical activity, adequate sleep, and maintaining social connections. If stress is significantly impacting your daily life, consider speaking with a healthcare professional.",
  "emergency": "If you're experiencing a medical emergency, please call emergency services immediately (911 in the US). This includes chest pain, difficulty breathing, severe bleeding, loss of consciousness, or other life-threatening symptoms.",
  "pain": "Pain can have many causes. For mild pain, over-the-counter pain relievers may help. If pain is severe, persistent, or accompanied by other concerning symptoms, please consult a healthcare professional.",
  "nausea": "Nausea can be caused by various factors including food poisoning, motion sickness, or underlying medical conditions. Rest, staying hydrated, and avoiding strong smells may help. If nausea is severe or persistent, consult a healthcare professional.",
  "dizziness": "Dizziness can be caused by dehydration, low blood pressure, or inner ear problems. Sit or lie down to prevent falls, stay hydrated, and avoid sudden movements. If dizziness is severe or accompanied by other symptoms, seek medical attention.",
  "fatigue": "Fatigue can be caused by lack of sleep, stress, poor nutrition, or underlying medical conditions. Ensure adequate sleep, maintain a balanced diet, and stay hydrated. If fatigue is persistent or severe, consult a healthcare professional.",
};

const EchoMedEmergencyChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m Dr. Echo, your EchoMed AI health assistant. I\'m now powered by advanced AI to provide you with better health guidance and medicine recommendations.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAIAvailable, setIsAIAvailable] = useState(true); // Assume AI is available
  const [aiStatus, setAiStatus] = useState<'online' | 'offline'>('online');

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById('emergency-chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact matches
    if (EMERGENCY_RESPONSES[lowerMessage]) {
      return EMERGENCY_RESPONSES[lowerMessage];
    }
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(EMERGENCY_RESPONSES)) {
      if (keyword !== 'default' && lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Return default response
    return EMERGENCY_RESPONSES['default'];
  };

  const simulateTyping = (text: string, callback: (text: string) => void) => {
    return new Promise<void>((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        callback(text.substring(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 30); // Speed of typing simulation
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      let responseText: string;
      
      // Try to use OpenAI first
      if (isAIAvailable) {
        try {
          // Prepare conversation history for context
          const conversationHistory = messages
            .filter(msg => msg.role === 'user' || msg.role === 'assistant')
            .slice(-10) // Last 10 messages for context
            .map(msg => ({
              role: msg.role,
              content: msg.content
            }));
          
          const aiResponse = await geminiService.getHealthConsultation(
            inputValue,
            'user-' + Date.now(),
            conversationHistory
          );
          
          if (aiResponse.success) {
            responseText = aiResponse.response;
            setAiStatus('online');
          } else {
            throw new Error('AI service failed');
          }
        } catch (aiError) {
          console.warn('AI service unavailable, falling back to emergency mode:', aiError);
          setAiStatus('offline');
          responseText = getResponse(inputValue);
        }
      } else {
        // Use emergency mode
        responseText = getResponse(inputValue);
      }
      
      // Simulate typing effect
      let currentResponse = '';
      await simulateTyping(responseText, (text) => {
        currentResponse = text;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = text;
          } else {
            newMessages.push({
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: text,
              timestamp: new Date(),
            });
          }
          return newMessages;
        });
      });
      
    } catch (error) {
      console.error('Error processing message:', error);
      // Fallback to emergency response
      const fallbackResponse = getResponse(inputValue);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "I have a headache",
    "What are cold symptoms?",
    "How to improve sleep?",
    "Exercise recommendations",
    "Stress management",
    "Emergency symptoms"
  ];

  return (
    <div className="h-[600px] flex flex-col bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg overflow-hidden border-2 border-orange-200 dark:border-orange-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            {aiStatus === 'online' ? (
              <Sparkles className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {aiStatus === 'online' ? 'AI-Powered Mode' : 'Emergency Mode'}
            </h3>
            <p className="text-sm text-orange-100">
              {aiStatus === 'online' ? 'Advanced AI Health Assistant' : 'Offline Health Assistant'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className={`${
              aiStatus === 'online' 
                ? 'bg-green-500/20 text-green-100 border-green-300/30' 
                : 'bg-white/20 text-white border-white/30'
            }`}
          >
            {aiStatus === 'online' ? (
              <>
                <Sparkles className="w-3 h-3 mr-1" />
                AI Online
              </>
            ) : (
              <>
                <Shield className="w-3 h-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div id="emergency-chat-messages" className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">
                        {message.role === 'user' ? 'You' : `Dr. Echo (${aiStatus === 'online' ? 'AI' : 'Emergency'})`}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Dr. Echo is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-3 font-medium">
            Quick health questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(question)}
                className="text-xs border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Notice */}
      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 border-t border-orange-200 dark:border-orange-800">
        <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200 text-xs">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">Emergency Notice:</span>
          <span>For life-threatening emergencies, call 911 immediately.</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-900">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a health question..."
              className="min-h-[60px] max-h-[120px] resize-none border-orange-300 focus:border-orange-500"
              onKeyDown={handleKeyPress}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="h-10 px-4 bg-orange-600 hover:bg-orange-700"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { EchoMedEmergencyChat }; 