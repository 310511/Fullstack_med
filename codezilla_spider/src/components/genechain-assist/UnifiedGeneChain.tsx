import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Lock, 
  Unlock, 
  Dna, 
  Activity, 
  AlertTriangle, 
  Heart, 
  Brain, 
  Eye,
  Globe,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Database,
  Key,
  Hospital,
  Stethoscope,
  AlertCircle,
  Play,
  Pause,
  X,
  Save,
  List,
  Network,
  Microscope,
  UserCheck,
  ClipboardList,
  TrendingUp,
  BarChart3,
  FileText,
  Upload,
  Search,
  Settings,
  User,
  Bell,
  ChevronRight,
  ChevronDown,
  FileSpreadsheet,
  BrainCircuit,
  ShieldCheck,
  FileCheck,
  Download,
  Eye as EyeIcon,
  Calendar,
  Hash,
  ExternalLink,
  Copy,
  Loader2,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import ProposalForm from './ProposalForm';
import ProposalsList from './ProposalsList';
import ProposalDetails from './ProposalDetails';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  promoterValidationService, 
  PromoterValidationRequest, 
  PromoterValidationResult,
  ValidationHistory,
  TransactionDetails
} from '@/services/promoterValidationService';

interface Proposal {
  id: string;
  geneTarget: string;
  modificationType: string;
  patientId: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  consentStatus: 'pending' | 'obtained' | 'denied';
}

interface GeneExpressionData {
  patientId: string;
  sampleData: any;
  prediction: string;
  probability: number;
  topGenes: Array<{ gene: string; importance: number }>;
  modelHash: string;
  blockchainTx: string;
  timestamp: string;
  status: 'processing' | 'completed' | 'failed';
}

interface AuditLog {
  id: string;
  patientId: string;
  action: string;
  modelHash: string;
  prediction: string;
  probability: number;
  blockchainTx: string;
  timestamp: string;
  userRole: string;
}

interface PromoterData {
  id: string;
  sequence: string;
  prediction: 'promoter' | 'non_promoter';
  probability: number;
  modelHash: string;
  blockchainTx: string;
  timestamp: string;
  referenceMatches: Array<{ database: string; match: string; score: number }>;
  sequence_hash?: string;
  motifs_found?: Array<{
    name: string;
    pattern: string;
    position: number;
    found: boolean;
  }>;
  validation_hash?: string;
  analyst_id?: string;
  patient_id?: string;
}

interface ConsentRequest {
  id: string;
  patientId: string;
  requesterId: string;
  requesterRole: string;
  requestType: 'read' | 'write' | 'full';
  duration: number; // days
  status: 'pending' | 'approved' | 'denied' | 'expired';
  timestamp: string;
  expiryDate: string;
  blockchainTx: string;
}

interface ReportData {
  id: string;
  type: 'gene_expression' | 'promoter' | 'consent' | 'combined';
  patientId?: string;
  startDate: string;
  endDate: string;
  data: any;
  blockchainTx: string;
  generatedAt: string;
  downloadUrl: string;
}

const UnifiedGeneChain: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'variants' | 'audit' | 'promoter' | 'consent' | 'reports'>('dashboard');
  const [activeTab, setActiveTab] = useState<'assist' | 'emergency'>('assist');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentEmergency, setCurrentEmergency] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showProposalsList, setShowProposalsList] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<'Doctor' | 'Regulator' | 'Patient'>('Doctor');
  const [geneExpressionData, setGeneExpressionData] = useState<GeneExpressionData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditTab, setAuditTab] = useState<'upload' | 'analysis' | 'blockchain' | 'report'>('upload');
  
  // Promoter Validation State
  const [promoterData, setPromoterData] = useState<PromoterData | null>(null);
  const [promoterTab, setPromoterTab] = useState<'upload' | 'prediction' | 'blockchain' | 'reports'>('upload');
  const [promoterLoading, setPromoterLoading] = useState(false);
  const [promoterError, setPromoterError] = useState<string | null>(null);
  const [validationHistory, setValidationHistory] = useState<ValidationHistory | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [currentSequence, setCurrentSequence] = useState('');
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  
  // Consent Management State
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [consentTab, setConsentTab] = useState<'pending' | 'active' | 'blockchain'>('pending');
  
  // Reports State
  const [reports, setReports] = useState<ReportData[]>([]);
  const [reportsTab, setReportsTab] = useState<'gene_expression' | 'promoter' | 'consent' | 'export'>('gene_expression');
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Emergency scenarios data
  const emergencies = [
    {
      title: "Unknown Drug Reaction",
      description: "Patient experiencing severe allergic reaction to medication",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Genetic Disorder Emergency",
      description: "Sudden onset of symptoms requiring immediate genetic analysis",
      icon: Dna,
      color: "blue"
    },
    {
      title: "Surgical Emergency",
      description: "Emergency surgery requiring genetic compatibility check",
      icon: Stethoscope,
      color: "green"
    }
  ];

  // Mock audit logs data
  useEffect(() => {
    setAuditLogs([
      {
        id: '1',
        patientId: 'P001',
        action: 'Gene Expression Analysis',
        modelHash: '0x1234...5678',
        prediction: 'ALL',
        probability: 0.87,
        blockchainTx: '0xabcd...efgh',
        timestamp: '2024-01-15T10:30:00Z',
        userRole: 'Doctor'
      },
      {
        id: '2',
        patientId: 'P002',
        action: 'Gene Expression Analysis',
        modelHash: '0x8765...4321',
        prediction: 'AML',
        probability: 0.92,
        blockchainTx: '0xdcba...hgfe',
        timestamp: '2024-01-14T15:45:00Z',
        userRole: 'Researcher'
      }
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && activeTab === 'emergency') {
        setCurrentEmergency((prev) => (prev + 1) % emergencies.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, emergencies.length, activeTab]);

  const toggleDemo = () => setShowDemo(!showDemo);

  const handleProposalSubmit = (formData: {
    geneTarget: string;
    modificationType: string;
    patientId: string;
    description: string;
    riskLevel: string;
  }) => {
    const newProposal: Proposal = {
      id: Date.now().toString(),
      ...formData,
      riskLevel: formData.riskLevel as 'low' | 'medium' | 'high',
      status: 'pending',
      timestamp: new Date().toISOString(),
      consentStatus: 'pending'
    };
    setProposals([...proposals, newProposal]);
    setShowProposalForm(false);
  };

  const handleGeneExpressionFileUpload = async (file: File) => {
    // Simulate file processing
    const mockData: GeneExpressionData = {
      patientId: 'P' + Date.now(),
      sampleData: { genes: 20000, samples: 1 },
      prediction: 'ALL',
      probability: 0.87,
      topGenes: [
        { gene: 'CD19', importance: 0.15 },
        { gene: 'CD20', importance: 0.12 },
        { gene: 'CD22', importance: 0.10 },
        { gene: 'CD79A', importance: 0.08 },
        { gene: 'PAX5', importance: 0.07 }
      ],
      modelHash: '0x' + Math.random().toString(16).substr(2, 8),
      blockchainTx: '0x' + Math.random().toString(16).substr(2, 16),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setGeneExpressionData(mockData);
  };

  const generateReport = () => {
    // Simulate PDF generation
    const link = document.createElement('a');
    link.href = '#';
    link.download = `gene-expression-report-${Date.now()}.pdf`;
    link.click();
  };

  // Promoter Validation Handlers
  const handlePromoterUpload = async (sequence: string) => {
    console.log('handlePromoterUpload called with sequence:', sequence);
    
    if (!sequence.trim()) {
      console.log('Sequence is empty, setting error');
      setPromoterError('Please enter a DNA sequence');
      return;
    }

    console.log('Setting loading state to true');
    setPromoterLoading(true);
    setPromoterError(null);

    try {
      console.log('Validating sequence...');
      // Validate sequence
      const validation = promoterValidationService.validateDNASequence(sequence);
      if (!validation.isValid) {
        console.log('Validation failed:', validation.errors);
        setPromoterError(validation.errors.join(', '));
        return;
      }

      console.log('Preparing API request...');
      // Prepare request
      const request: PromoterValidationRequest = {
        sequence: sequence.toUpperCase(),
        patient_id: `P${Date.now()}`,
        analyst_id: 'ANALYST001',
        user_role: userRole
      };

      console.log('Calling API with request:', request);
      // Call API
      const result = await promoterValidationService.validatePromoter(request);
      console.log('API response received:', result);

      // Convert API result to PromoterData format
      const promoterData: PromoterData = {
        id: result.id,
        sequence: sequence,
        prediction: result.prediction as 'promoter' | 'non_promoter',
        probability: result.probability,
        modelHash: result.model_version_hash,
        blockchainTx: result.blockchain_tx,
        timestamp: result.timestamp,
        sequence_hash: result.sequence_hash,
        motifs_found: result.motifs_found,
        validation_hash: result.validation_hash,
        analyst_id: result.analyst_id,
        patient_id: result.patient_id,
        referenceMatches: [
          { database: 'NCBI', match: 'NM_001123456', score: 0.95 },
          { database: 'Ensembl', match: 'ENST00000123456', score: 0.87 }
        ]
      };

      console.log('Setting promoter data:', promoterData);
      setPromoterData(promoterData);
      setCurrentSequence(sequence);
      
      // Switch to prediction tab
      setPromoterTab('prediction');
      
    } catch (error) {
      console.error('Promoter validation failed:', error);
      setPromoterError(error instanceof Error ? error.message : 'Validation failed');
    } finally {
      console.log('Setting loading state to false');
      setPromoterLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setPromoterLoading(true);
    setPromoterError(null);
    setFileUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const sequence = promoterValidationService.extractSequenceFromFASTA(content);
          
          // Simulate upload progress
          for (let i = 0; i <= 100; i += 10) {
            setFileUploadProgress(i);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          await handlePromoterUpload(sequence);
        } catch (error) {
          setPromoterError('Failed to process file');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setPromoterError('Failed to read file');
    } finally {
      setPromoterLoading(false);
      setFileUploadProgress(0);
    }
  };

  const handleLogToBlockchain = async () => {
    if (!promoterData) return;

    setPromoterLoading(true);
    setPromoterError(null);

    try {
      const result = await promoterValidationService.logToBlockchain({
        patient_id: promoterData.patient_id || 'P001',
        validation_id: promoterData.id
      });

      // Update promoter data with new blockchain info
      setPromoterData(prev => prev ? {
        ...prev,
        blockchainTx: result.blockchain_tx
      } : null);

      // Switch to blockchain tab
      setPromoterTab('blockchain');
      
    } catch (error) {
      console.error('Blockchain logging failed:', error);
      setPromoterError(error instanceof Error ? error.message : 'Blockchain logging failed');
    } finally {
      setPromoterLoading(false);
    }
  };

  const loadValidationHistory = async (patientId: string) => {
    try {
      const history = await promoterValidationService.getValidationHistory(patientId);
      setValidationHistory(history);
    } catch (error) {
      console.error('Failed to load validation history:', error);
    }
  };

  const loadTransactionDetails = async (txHash: string) => {
    try {
      const details = await promoterValidationService.getTransactionDetails(txHash);
      setTransactionDetails(details);
    } catch (error) {
      console.error('Failed to load transaction details:', error);
    }
  };

  // Consent Management Handlers
  const handleConsentGrant = (requestId: string) => {
    setConsentRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleConsentRevoke = (requestId: string) => {
    setConsentRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'denied' as const } : req
    ));
  };

  // Reports Handlers
  const generateCombinedReport = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `combined-report-${Date.now()}.pdf`;
    link.click();
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, active: activeSection === 'dashboard' },
    { id: 'variants', label: 'Genetic Variants', icon: Dna, active: activeSection === 'variants' },
    { id: 'audit', label: 'Gene Expression Audit Trail', icon: FileCheck, active: activeSection === 'audit' },
    { id: 'promoter', label: 'Promoter Validation', icon: ShieldCheck, active: activeSection === 'promoter' },
    { id: 'consent', label: 'Consent Management', icon: UserCheck, active: activeSection === 'consent' },
    { id: 'reports', label: 'Reports & Audit Logs', icon: FileText, active: activeSection === 'reports' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Analyses</p>
              <p className="text-2xl font-bold text-blue-500">1,247</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blockchain Transactions</p>
              <p className="text-2xl font-bold text-green-500">892</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Hash className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Consents</p>
              <p className="text-2xl font-bold text-purple-500">156</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.action} for Patient {log.patientId}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(log.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ML Models</span>
              <span className="text-green-500 text-sm">✓ Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Blockchain</span>
              <span className="text-green-500 text-sm">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Database</span>
              <span className="text-green-500 text-sm">✓ Healthy</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderGeneExpressionAudit = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'upload', label: 'Upload & Preprocess', icon: Upload },
          { id: 'analysis', label: 'Analysis', icon: BrainCircuit },
          { id: 'blockchain', label: 'Blockchain Audit', icon: Hash },
          { id: 'report', label: 'Report', icon: Download }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAuditTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              auditTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {auditTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Upload Gene Expression Data
            </h3>
            <div className="space-y-4">
              <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upload CSV file with ALL/AML gene expression data
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Supports: CSV files with gene expression matrix
                </p>
                <button
                                      onClick={() => handleGeneExpressionFileUpload(new File([''], 'sample.csv'))}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Sample Data
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {auditTab === 'analysis' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {geneExpressionData ? (
              <>
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Analysis Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prediction</p>
                      <p className="text-2xl font-bold text-blue-600">{geneExpressionData.prediction}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence</p>
                      <p className="text-2xl font-bold text-green-600">{(geneExpressionData.probability * 100).toFixed(1)}%</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Model Hash</p>
                      <p className="text-sm font-mono text-gray-600">{geneExpressionData.modelHash}</p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Top Contributing Genes
                  </h3>
                  <div className="space-y-3">
                    {geneExpressionData.topGenes.map((gene, index) => (
                      <div key={gene.gene} className="flex items-center justify-between">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {index + 1}. {gene.gene}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${gene.importance * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {(gene.importance * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg text-center`}>
                <BrainCircuit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No analysis data available
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Upload data in the Upload tab to see analysis results
                </p>
              </div>
            )}
          </motion.div>
        )}

        {auditTab === 'blockchain' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Blockchain Audit Trail
              </h3>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Patient {log.patientId}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Prediction: </span>
                        <span className="font-medium text-blue-600">{log.prediction}</span>
                      </div>
                      <div>
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence: </span>
                        <span className="font-medium text-green-600">{(log.probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transaction: </span>
                        <span className="font-mono text-xs text-gray-600">{log.blockchainTx}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {auditTab === 'report' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Generate Report
            </h3>
            <div className="space-y-4">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Generate a comprehensive PDF report including:
              </p>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Prediction results and confidence scores</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Model version and parameters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Blockchain transaction hash</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Patient ID and timestamp</span>
                </li>
              </ul>
              <button
                onClick={generateReport}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Generate PDF Report</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderPromoterValidation = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'upload', label: 'Sequence Input', icon: Upload },
          { id: 'prediction', label: 'ML Prediction', icon: BrainCircuit },
          { id: 'blockchain', label: 'Blockchain Validation Log', icon: Hash },
          { id: 'reports', label: 'Reports', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPromoterTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              promoterTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {promoterTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              DNA Sequence Input
            </h3>

            {/* Error Display */}
            {promoterError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'} mb-4`}
              >
                <div className="flex items-center space-x-2">
                  <AlertCircleIcon className="w-5 h-5 text-red-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    {promoterError}
                  </span>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              {/* File Upload Section */}
              <div className={`border-2 border-dashed rounded-lg p-6 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${promoterLoading ? 'opacity-50' : ''}`}>
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Upload FASTA File
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                    Supports .fasta, .txt files with raw DNA sequence
                  </p>
                  
                  {/* Upload Progress */}
                  {fileUploadProgress > 0 && fileUploadProgress < 100 && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileUploadProgress}%` }}
                        ></div>
                      </div>
                      <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Processing file... {fileUploadProgress}%
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".fasta,.txt"
                    className="hidden"
                    id="fasta-upload"
                    disabled={promoterLoading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="fasta-upload"
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      promoterLoading 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {promoterLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {promoterLoading ? 'Processing...' : 'Choose File'}
                  </label>
                </div>
              </div>

              {/* Manual Input Section */}
              <div className="space-y-4">
                <h4 className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Or Paste DNA Sequence
                </h4>
                <textarea
                  placeholder="Paste DNA sequence here (ATCG...)"
                  className={`w-full h-40 p-4 border rounded-lg font-mono text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  disabled={promoterLoading}
                  value={currentSequence}
                  onChange={(e) => {
                    const sequence = e.target.value.toUpperCase().replace(/[^ATCG]/g, '');
                    setCurrentSequence(sequence);
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Only A, T, C, G characters allowed • Min length: 10 nucleotides
                  </div>
                  <button
                    onClick={() => handlePromoterUpload(currentSequence)}
                    disabled={promoterLoading || !currentSequence.trim()}
                    className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      promoterLoading || !currentSequence.trim()
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {promoterLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BrainCircuit className="w-4 h-4" />
                    )}
                    <span>{promoterLoading ? 'Analyzing...' : 'Run Promoter Analysis'}</span>
                  </button>
                </div>
              </div>

              {/* Sequence Validation */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Pre-validation Check
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      currentSequence && /^[ATCG]+$/.test(currentSequence) 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                    }`}></div>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Valid DNA characters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      currentSequence && currentSequence.length >= 10 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                    }`}></div>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Sequence length OK ({currentSequence.length} nucleotides)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Sequences */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sample Sequences
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setCurrentSequence("TATAAAATCGATCGATCG")}
                    disabled={promoterLoading}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Promoter Sequence
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Contains TATA box motif
                    </div>
                  </button>
                  <button
                    onClick={() => setCurrentSequence("ATCGATCGATCGATCGATCG")}
                    disabled={promoterLoading}
                    className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Random Sequence
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No known motifs
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {promoterTab === 'prediction' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {promoterData ? (
              <>
                {/* Main Prediction Results */}
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ML Prediction Results
                  </h3>
                  
                  {/* Prediction Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Classification</p>
                      <p className={`text-2xl font-bold ${promoterData.prediction === 'promoter' ? 'text-green-600' : 'text-red-600'}`}>
                        {promoterData.prediction === 'promoter' ? 'Promoter' : 'Non-Promoter'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence Score</p>
                      <p className="text-2xl font-bold text-blue-600">{(promoterData.probability * 100).toFixed(1)}%</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Model Version</p>
                      <p className="text-sm font-mono text-gray-600">{promoterData.modelHash}</p>
                    </div>
                  </div>

                  {/* Blockchain Logging Button */}
                  <div className="mb-6">
                    <button
                      onClick={handleLogToBlockchain}
                      disabled={promoterLoading}
                      className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                        promoterLoading
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {promoterLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Hash className="w-4 h-4" />
                      )}
                      <span>{promoterLoading ? 'Logging to Blockchain...' : 'Log Validation to Blockchain'}</span>
                    </button>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="mb-6">
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confidence Visualization
                    </h4>
                    <div className="relative">
                      <div className={`w-full h-4 bg-gray-200 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div 
                          className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-1000"
                          style={{ width: `${promoterData.probability * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>0%</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>50%</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motif Detection */}
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Detected Biological Motifs
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promoterData.motifs_found ? (
                      promoterData.motifs_found.map((motif, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{motif.name}</span>
                            <span className={`text-sm ${motif.found ? 'text-green-600' : 'text-gray-500'}`}>
                              {motif.found ? 'Found' : 'Not Found'}
                            </span>
                          </div>
                          <p className="text-sm font-mono text-gray-600">{motif.pattern}</p>
                          {motif.found && motif.position >= 0 && (
                            <p className="text-xs text-gray-500 mt-1">Position: {motif.position}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      // Fallback to static motifs if API data not available
                      <>
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>TATA Box</span>
                            <span className="text-green-600 text-sm">Found</span>
                          </div>
                          <p className="text-sm font-mono text-gray-600">TATAAA</p>
                        </div>
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>CAAT Box</span>
                            <span className="text-green-600 text-sm">Found</span>
                          </div>
                          <p className="text-sm font-mono text-gray-600">CAAT</p>
                        </div>
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>-10 Region</span>
                            <span className="text-green-600 text-sm">Found</span>
                          </div>
                          <p className="text-sm font-mono text-gray-600">TATAAT</p>
                        </div>
                        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>-35 Region</span>
                            <span className="text-green-600 text-sm">Found</span>
                          </div>
                          <p className="text-sm font-mono text-gray-600">TTGACA</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Sequence Visualization */}
                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Sequence with Motif Highlights
                  </h4>
                  <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="whitespace-pre-wrap break-all">
                      {promoterData.sequence ? (
                        promoterData.sequence.split('').map((char, index) => {
                          // Highlight motifs
                          const isTATA = promoterData.sequence.substring(index, index + 6) === 'TATAAA';
                          const isCAAT = promoterData.sequence.substring(index, index + 4) === 'CAAT';
                          const isMinus10 = promoterData.sequence.substring(index, index + 6) === 'TATAAT';
                          const isMinus35 = promoterData.sequence.substring(index, index + 6) === 'TTGACA';
                          
                          let bgColor = '';
                          if (isTATA || isMinus10 || isMinus35) bgColor = 'bg-yellow-200 text-yellow-900';
                          else if (isCAAT) bgColor = 'bg-blue-200 text-blue-900';
                          
                          return (
                            <span key={index} className={`${bgColor} px-0.5`}>
                              {char}
                            </span>
                          );
                        })
                      ) : (
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          No sequence data available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>TATA Box / -10/-35</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-200 rounded"></div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>CAAT Box</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg text-center`}>
                <BrainCircuit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No prediction data available
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Upload a sequence in the Sequence Input tab to see prediction results
                </p>
              </div>
            )}
          </motion.div>
        )}

        {promoterTab === 'blockchain' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Blockchain Status */}
            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Blockchain Validation Log
              </h3>
              
              {promoterData ? (
                <div className="space-y-6">
                  {/* Current Validation */}
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Latest Validation
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                        Confirmed
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction Hash</p>
                        <p className="font-mono text-sm text-gray-600 break-all">{promoterData.blockchainTx}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Block Number</p>
                        <p className="font-mono text-sm text-gray-600">#1,234,567</p>
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Timestamp</p>
                        <p className="text-sm text-gray-600">{new Date(promoterData.timestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gas Used</p>
                        <p className="text-sm text-gray-600">45,678</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${promoterData.blockchainTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View on Etherscan</span>
                      </a>
                      <button
                        onClick={() => {/* Copy to clipboard */}}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Hash</span>
                      </button>
                    </div>
                  </div>

                  {/* Smart Contract Details */}
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Smart Contract Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contract Address</p>
                        <p className="font-mono text-gray-600">0x1234...5678</p>
                      </div>
                      <div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Function Called</p>
                        <p className="font-mono text-gray-600">logValidation()</p>
                      </div>
                      <div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sequence Hash</p>
                        <p className="font-mono text-gray-600">0xabcd...efgh</p>
                      </div>
                      <div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Model Hash</p>
                        <p className="font-mono text-gray-600">{promoterData.modelHash}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Hash className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    No blockchain data available
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Run a prediction first to see blockchain validation logs
                  </p>
                </div>
              )}
            </div>

            {/* Validation Timeline */}
            {promoterData && (
              <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Validation Timeline
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Validation Logged
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(promoterData.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Promoter validation result logged to Ethereum Sepolia testnet
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          ML Analysis Completed
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(promoterData.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Machine learning model predicted: {promoterData.prediction} ({(promoterData.probability * 100).toFixed(1)}% confidence)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Sequence Uploaded
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(promoterData.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        DNA sequence uploaded and validated
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {promoterTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Report Generation */}
            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Promoter Validation Reports
              </h3>
              
              {promoterData ? (
                <div className="space-y-6">
                  {/* Report Summary */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Report Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analysis Date</p>
                        <p className="text-gray-600">{new Date(promoterData.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Classification</p>
                        <p className={`font-medium ${promoterData.prediction === 'promoter' ? 'text-green-600' : 'text-red-600'}`}>
                          {promoterData.prediction === 'promoter' ? 'Promoter' : 'Non-Promoter'}
                        </p>
                      </div>
                      <div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Confidence</p>
                        <p className="text-gray-600">{(promoterData.probability * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Blockchain TX</p>
                        <p className="font-mono text-xs text-gray-600 break-all">{promoterData.blockchainTx}</p>
                      </div>
                    </div>
                  </div>

                  {/* Report Content Preview */}
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Report Content Preview
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Input sequence hash (not raw DNA)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Prediction & probability score
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Detected biological motifs
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Blockchain TX hash & block number
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Analyst ID & timestamp
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Model version hash
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Report Actions */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = '#';
                        link.download = `promoter-validation-report-${Date.now()}.pdf`;
                        link.click();
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Generate PDF Report</span>
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = '#';
                        link.download = `promoter-validation-data-${Date.now()}.json`;
                        link.click();
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Export JSON Data</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    No validation data available
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Run a promoter validation first to generate reports
                  </p>
                </div>
              )}
            </div>

            {/* Report History */}
            {promoterData && (
              <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Recent Validation Reports
                </h4>
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Promoter Validation Report
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(promoterData.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm px-2 py-1 rounded ${promoterData.prediction === 'promoter' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {promoterData.prediction === 'promoter' ? 'Promoter' : 'Non-Promoter'}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderConsentManagement = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'pending', label: 'Pending Requests', icon: Clock },
          { id: 'active', label: 'Active Consents', icon: UserCheck },
          { id: 'blockchain', label: 'Blockchain Ledger', icon: Hash }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setConsentTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              consentTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {consentTab === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Pending Consent Requests
            </h3>
            <div className="space-y-4">
              {consentRequests.filter(req => req.status === 'pending').map((request) => (
                <div key={request.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {request.requesterRole} - {request.requesterId}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
                      {request.requestType}
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    Requesting access for {request.duration} days
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleConsentGrant(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Grant Access
                    </button>
                    <button
                      onClick={() => handleConsentRevoke(request.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Deny Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {consentTab === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Active Consents
            </h3>
            <div className="space-y-4">
              {consentRequests.filter(req => req.status === 'approved').map((request) => (
                <div key={request.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {request.requesterRole} - {request.requesterId}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                      Active
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Expires: {new Date(request.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {consentTab === 'blockchain' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Blockchain Consent Ledger
            </h3>
            <div className="space-y-4">
              {consentRequests.map((request) => (
                <div key={request.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {request.status.toUpperCase()}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(request.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600">{request.blockchainTx}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'gene_expression', label: 'Gene Expression Logs', icon: BarChart3 },
          { id: 'promoter', label: 'Promoter Validation Logs', icon: ShieldCheck },
          { id: 'consent', label: 'Consent History Logs', icon: UserCheck },
          { id: 'export', label: 'Export Center', icon: Download }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportsTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              reportsTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {reportsTab === 'gene_expression' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Gene Expression Analysis Logs
            </h3>
            <div className="space-y-4">
              {auditLogs.filter(log => log.action.includes('Gene Expression')).map((log) => (
                <div key={log.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Patient {log.patientId} - {log.prediction}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600">{log.blockchainTx}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {reportsTab === 'export' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Export Center
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Combined Report
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  Generate a comprehensive report including all analysis types
                </p>
                <button
                  onClick={generateCombinedReport}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate Combined Report</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'audit':
        return renderGeneExpressionAudit();
      case 'promoter':
        return renderPromoterValidation();
      case 'consent':
        return renderConsentManagement();
      case 'reports':
        return renderReports();
      default:
        return (
          <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg text-center`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {navigationItems.find(item => item.id === activeSection)?.label}
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              This feature is coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900'}`}>
      {/* Background Animation */}
      <motion.div
        style={{ y }}
        className="fixed inset-0 pointer-events-none"
      >
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-200'} opacity-20 blur-xl animate-pulse`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 rounded-full ${isDarkMode ? 'bg-green-500' : 'bg-green-200'} opacity-20 blur-xl animate-pulse delay-1000`}></div>
        <div className={`absolute bottom-20 left-1/3 w-40 h-40 rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-purple-200'} opacity-20 blur-xl animate-pulse delay-2000`}></div>
      </motion.div>

      <div className="relative z-10">
        {/* Top Navbar */}
        <div className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                GeneChain Unified Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                {userRole}
              </div>
              <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <Bell className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <motion.div
            initial={{ width: sidebarCollapsed ? 64 : 280 }}
            animate={{ width: sidebarCollapsed ? 64 : 280 }}
            className={`${isDarkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'} min-h-screen transition-all duration-300`}
          >
            <div className="p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      item.active
                        ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`
                        : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Emergency Response Demo
              </h3>
              <button
                onClick={() => setShowDemo(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                This is a demonstration of the emergency response system. In a real scenario, this would show how genetic emergency keys are accessed and used.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDemo(false)}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showProposalForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProposalForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProposalForm onSubmit={handleProposalSubmit} onClose={() => setShowProposalForm(false)} isDarkMode={isDarkMode} />
          </motion.div>
        </motion.div>
      )}

      {showProposalsList && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProposalsList(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-4xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProposalsList proposals={proposals} onClose={() => setShowProposalsList(false)} isDarkMode={isDarkMode} />
          </motion.div>
        </motion.div>
      )}

      {currentProposal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setCurrentProposal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProposalDetails proposal={currentProposal} onClose={() => setCurrentProposal(null)} isDarkMode={isDarkMode} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UnifiedGeneChain;
