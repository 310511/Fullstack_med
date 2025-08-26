// Promoter Validation Service
// Handles DNA sequence analysis and promoter validation

export interface PromoterValidationRequest {
  sequence: string;
  patient_id?: string;
  analyst_id?: string;
  user_role?: string;
}

export interface PromoterValidationResult {
  id: string;
  patient_id?: string;
  analyst_id: string;
  sequence_hash: string;
  prediction: string;
  probability: number;
  motifs_found: Array<{
    name: string;
    pattern: string;
    position: number;
    found: boolean;
  }>;
  model_version_hash: string;
  validation_hash: string;
  blockchain_tx: string;
  timestamp: string;
  user_role: string;
}

export interface ValidationHistory {
  patient_id: string;
  validations: Array<{
    id: string;
    sequence_hash: string;
    prediction: string;
    probability: number;
    timestamp: string;
    blockchain_tx: string;
  }>;
  total_count: number;
}

export interface TransactionDetails {
  transaction: {
    tx_hash: string;
    sequence_hash: string;
    model_hash: string;
    prediction: string;
    probability: number;
    block_number: number;
    timestamp: string;
    gas_used: number;
  };
  etherscan_url: string;
  status: string;
}

export interface GeneExpressionRequest {
  patient_id: string;
  sample_data: any;
  analysis_type: 'expression' | 'mutation' | 'regulation';
}

export interface GeneExpressionResult {
  patient_id: string;
  sample_data: any;
  prediction: string;
  probability: number;
  top_genes: Array<{ gene: string; importance: number }>;
  model_hash: string;
  blockchain_tx: string;
  timestamp: string;
  status: 'processing' | 'completed' | 'failed';
}

class PromoterValidationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8002'; // Promoter validation API port
  }

  // Validate DNA sequence for promoter classification
  async validatePromoter(request: PromoterValidationRequest): Promise<PromoterValidationResult> {
    try {
      const formData = new FormData();
      formData.append('sequence', request.sequence);
      if (request.patient_id) formData.append('patient_id', request.patient_id);
      formData.append('analyst_id', request.analyst_id || 'ANALYST001');
      formData.append('user_role', request.user_role || 'Doctor');

      const response = await fetch(`${this.baseUrl}/promoter/validate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error validating promoter:', error);
      throw error;
    }
  }

  // Get validation history for a patient
  async getValidationHistory(patientId: string): Promise<ValidationHistory> {
    try {
      const response = await fetch(`${this.baseUrl}/promoter/history/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting validation history:', error);
      throw error;
    }
  }

  // Get blockchain transaction details
  async getTransactionDetails(txHash: string): Promise<TransactionDetails> {
    try {
      const response = await fetch(`${this.baseUrl}/promoter/transaction/${txHash}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw error;
    }
  }

  // Log validation to blockchain
  async logToBlockchain(patientId: string, validationId: string): Promise<{ status: string; blockchain_tx: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/promoter/log-to-chain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          validation_id: validationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging to blockchain:', error);
      throw error;
    }
  }

  // Get available ML models
  async getAvailableModels(): Promise<{
    available_models: string[];
    model_descriptions: Record<string, string>;
    feature_count: number;
    is_loaded: boolean;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/promoter/models`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting available models:', error);
      throw error;
    }
  }

  // Get validation statistics
  async getValidationStatistics(): Promise<{
    total_validations: number;
    predictions: Record<string, number>;
    average_confidence: number;
    blockchain_transactions: number;
    timestamp: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/promoter/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting validation statistics:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    database: string;
    ml_models: string;
    blockchain: string;
    timestamp: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }

  // Mock data for development/testing
  getMockValidationResult(): PromoterValidationResult {
    return {
      id: 'mock-123',
      patient_id: 'P12345678',
      analyst_id: 'ANALYST001',
      sequence_hash: 'abc123def456',
      prediction: 'promoter',
      probability: 0.85,
      motifs_found: [
        {
          name: 'TATA Box',
          pattern: 'TATAAA',
          position: 25,
          found: true,
        },
        {
          name: 'CAAT Box',
          pattern: 'CAAT',
          position: 45,
          found: true,
        },
      ],
      model_version_hash: 'model-v1.0-hash',
      validation_hash: 'validation-hash-123',
      blockchain_tx: '0x1234567890abcdef',
      timestamp: new Date().toISOString(),
      user_role: 'Doctor',
    };
  }

  getMockValidationHistory(): ValidationHistory {
    return {
      patient_id: 'P12345678',
      validations: [
        {
          id: '1',
          sequence_hash: 'abc123def456',
          prediction: 'promoter',
          probability: 0.85,
          timestamp: new Date().toISOString(),
          blockchain_tx: '0x1234567890abcdef',
        },
        {
          id: '2',
          sequence_hash: 'def456ghi789',
          prediction: 'non_promoter',
          probability: 0.92,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          blockchain_tx: '0xabcdef1234567890',
        },
      ],
      total_count: 2,
    };
  }
}

// Export the service instance
export const promoterValidationService = new PromoterValidationService();

// Export the class for testing
export { PromoterValidationService };
