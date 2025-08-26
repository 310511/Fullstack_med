import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Database, Shield, Users, Activity, FileText } from 'lucide-react';

interface DashboardStats {
  gene_expression_records: number;
  variant_conflicts: number;
  promoter_validations: number;
  consent_records: number;
  genetic_risk_assessments: number;
  reproducibility_experiments: number;
  drug_response_records: number;
}

interface BlockchainRecord {
  blockchain_tx_hash: string;
  timestamp: string;
  [key: string]: any;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/genechain';

export default function GeneChainDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [expressionForm, setExpressionForm] = useState({
    dataset_name: '',
    analysis_type: '',
    model_version: '',
    results: '',
    researcher_id: ''
  });

  const [variantForm, setVariantForm] = useState({
    variant_id: '',
    original_classification: '',
    conflicting_classification: '',
    lab_id: '',
    evidence_level: ''
  });

  const [promoterForm, setPromoterForm] = useState({
    sequence: '',
    validator_id: ''
  });

  const [consentForm, setConsentForm] = useState({
    patient_id: '',
    dataset_type: '',
    consent_granted: true,
    researcher_id: ''
  });

  const [riskForm, setRiskForm] = useState({
    patient_id: '',
    risk_type: '',
    patient_data: '',
    model_version: ''
  });

  const [drugForm, setDrugForm] = useState({
    patient_id: '',
    drug_name: '',
    gene_markers: '',
    response_prediction: ''
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleDemoAll = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/demo/all`, { method: 'POST' });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'All blockchain features demonstrated successfully!' });
        fetchDashboardStats();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error running demo: ' + error });
    } finally {
      setLoading(false);
    }
  };

  const handleExpressionAudit = async () => {
    setLoading(true);
    try {
      const results = JSON.parse(expressionForm.results || '{}');
      const response = await fetch(`${API_BASE_URL}/expression/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expressionForm,
          results
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Gene expression analysis logged on blockchain!' });
        fetchDashboardStats();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error logging expression: ' + error });
    } finally {
      setLoading(false);
    }
  };

  const handleVariantConflict = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/variant/conflict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variantForm)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Variant conflict logged on blockchain!' });
        fetchDashboardStats();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error logging variant conflict: ' + error });
    } finally {
      setLoading(false);
    }
  };

  const handlePromoterValidation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/promoter/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoterForm)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Promoter sequence validated and stored on blockchain!' });
        fetchDashboardStats();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error validating promoter: ' + error });
    } finally {
      setLoading(false);
    }
  };

  const handleConsentCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/consent/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consentForm)
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Consent record created on blockchain!' });
        fetchDashboardStats();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating consent: ' + error });
    } finally {
      setLoading(false);
    }
  };

  const handleRiskAssessment = async () => {
    setLoading(true);
    try {
      const patient_data = JSON.parse(riskForm.patient_data || '{}');
      const response = await fetch(`${API_BASE_URL}/risk/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...riskForm,
          patient_data
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Genetic risk assessed and stored on blockchain!' });
        fetchDashboardStats();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error assessing risk: ' + error });
    } finally {
      setLoading(false);
    }
  };

  const handleDrugResponse = async () => {
    setLoading(true);
    try {
      const gene_markers = drugForm.gene_markers.split(',').map(marker => marker.trim());
      const response = await fetch(`${API_BASE_URL}/drug/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...drugForm,
          gene_markers
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Drug response logged on blockchain!' });
        fetchDashboardStats();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error logging drug response: ' + error });
    } finally {
      setLoading(false);
    }
  };

  const fetchLedger = async (type: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ledger/${type}`);
      const data = await response.json();
      if (data.status === 'success') {
        setRecords(data.records);
      }
    } catch (error) {
      console.error(`Error fetching ${type} ledger:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🧬 GeneChain Blockchain Dashboard</h1>
          <p className="text-gray-400">Immutable genomic data integrity and audit trail</p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="expression" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Expression
            </TabsTrigger>
            <TabsTrigger value="variants" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Variants
            </TabsTrigger>
            <TabsTrigger value="promoter" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Promoter
            </TabsTrigger>
            <TabsTrigger value="consent" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Consent
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Risk
            </TabsTrigger>
            <TabsTrigger value="drug" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Drug
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gene Expression</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.gene_expression_records || 0}</div>
                  <p className="text-xs text-muted-foreground">Records on blockchain</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Variant Conflicts</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.variant_conflicts || 0}</div>
                  <p className="text-xs text-muted-foreground">Conflicts resolved</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consent Records</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.consent_records || 0}</div>
                  <p className="text-xs text-muted-foreground">Patient consents</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Risk Assessments</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.genetic_risk_assessments || 0}</div>
                  <p className="text-xs text-muted-foreground">AI assessments</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDemoAll} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  🧬 Demo All Blockchain Features
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expression" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>🧬 Gene Expression Audit Trail</CardTitle>
                <p className="text-sm text-gray-400">Log gene expression analysis results on blockchain</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataset">Dataset Name</Label>
                    <Input
                      id="dataset"
                      value={expressionForm.dataset_name}
                      onChange={(e) => setExpressionForm({...expressionForm, dataset_name: e.target.value})}
                      placeholder="ALL_AML_train.csv"
                    />
                  </div>
                  <div>
                    <Label htmlFor="analysis">Analysis Type</Label>
                    <Input
                      id="analysis"
                      value={expressionForm.analysis_type}
                      onChange={(e) => setExpressionForm({...expressionForm, analysis_type: e.target.value})}
                      placeholder="leukemia_subtype_prediction"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model">Model Version</Label>
                    <Input
                      id="model"
                      value={expressionForm.model_version}
                      onChange={(e) => setExpressionForm({...expressionForm, model_version: e.target.value})}
                      placeholder="v2.1.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="researcher">Researcher ID</Label>
                    <Input
                      id="researcher"
                      value={expressionForm.researcher_id}
                      onChange={(e) => setExpressionForm({...expressionForm, researcher_id: e.target.value})}
                      placeholder="researcher_001"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="results">Results (JSON)</Label>
                  <Textarea
                    id="results"
                    value={expressionForm.results}
                    onChange={(e) => setExpressionForm({...expressionForm, results: e.target.value})}
                    placeholder='{"accuracy": 0.95, "predictions": [1, 0, 1]}'
                  />
                </div>
                <Button onClick={handleExpressionAudit} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Log on Blockchain
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>⚖️ Genetic Variant Conflict Resolution</CardTitle>
                <p className="text-sm text-gray-400">Log variant classification conflicts on blockchain</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="variant_id">Variant ID</Label>
                    <Input
                      id="variant_id"
                      value={variantForm.variant_id}
                      onChange={(e) => setVariantForm({...variantForm, variant_id: e.target.value})}
                      placeholder="rs123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lab_id">Lab ID</Label>
                    <Input
                      id="lab_id"
                      value={variantForm.lab_id}
                      onChange={(e) => setVariantForm({...variantForm, lab_id: e.target.value})}
                      placeholder="lab_001"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original">Original Classification</Label>
                    <Select value={variantForm.original_classification} onValueChange={(value) => setVariantForm({...variantForm, original_classification: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="benign">Benign</SelectItem>
                        <SelectItem value="pathogenic">Pathogenic</SelectItem>
                        <SelectItem value="uncertain">Uncertain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="conflicting">Conflicting Classification</Label>
                    <Select value={variantForm.conflicting_classification} onValueChange={(value) => setVariantForm({...variantForm, conflicting_classification: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="benign">Benign</SelectItem>
                        <SelectItem value="pathogenic">Pathogenic</SelectItem>
                        <SelectItem value="uncertain">Uncertain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="evidence">Evidence Level</Label>
                  <Select value={variantForm.evidence_level} onValueChange={(value) => setVariantForm({...variantForm, evidence_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select evidence level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strong">Strong</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="weak">Weak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleVariantConflict} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Log Conflict on Blockchain
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promoter" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>🔐 Promoter Integrity Validation</CardTitle>
                <p className="text-sm text-gray-400">Validate promoter sequences and store on blockchain</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sequence">DNA Sequence</Label>
                  <Textarea
                    id="sequence"
                    value={promoterForm.sequence}
                    onChange={(e) => setPromoterForm({...promoterForm, sequence: e.target.value})}
                    placeholder="ATCGATCGATCG"
                  />
                </div>
                <div>
                  <Label htmlFor="validator">Validator ID</Label>
                  <Input
                    id="validator"
                    value={promoterForm.validator_id}
                    onChange={(e) => setPromoterForm({...promoterForm, validator_id: e.target.value})}
                    placeholder="validator_001"
                  />
                </div>
                <Button onClick={handlePromoterValidation} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Validate & Store on Blockchain
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consent" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>📋 Consent Management</CardTitle>
                <p className="text-sm text-gray-400">Create patient consent records on blockchain</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient_id">Patient ID</Label>
                    <Input
                      id="patient_id"
                      value={consentForm.patient_id}
                      onChange={(e) => setConsentForm({...consentForm, patient_id: e.target.value})}
                      placeholder="patient_001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataset_type">Dataset Type</Label>
                    <Input
                      id="dataset_type"
                      value={consentForm.dataset_type}
                      onChange={(e) => setConsentForm({...consentForm, dataset_type: e.target.value})}
                      placeholder="AML_expression"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="researcher_consent">Researcher ID</Label>
                    <Input
                      id="researcher_consent"
                      value={consentForm.researcher_id}
                      onChange={(e) => setConsentForm({...consentForm, researcher_id: e.target.value})}
                      placeholder="researcher_001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="consent_granted">Consent Granted</Label>
                    <Select value={consentForm.consent_granted.toString()} onValueChange={(value) => setConsentForm({...consentForm, consent_granted: value === 'true'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleConsentCreate} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Consent Record
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>🧬 Genetic Risk Assessment</CardTitle>
                <p className="text-sm text-gray-400">Assess genetic risk and store on blockchain</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="risk_patient">Patient ID</Label>
                    <Input
                      id="risk_patient"
                      value={riskForm.patient_id}
                      onChange={(e) => setRiskForm({...riskForm, patient_id: e.target.value})}
                      placeholder="patient_001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="risk_type">Risk Type</Label>
                    <Input
                      id="risk_type"
                      value={riskForm.risk_type}
                      onChange={(e) => setRiskForm({...riskForm, risk_type: e.target.value})}
                      placeholder="AML_risk"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model_version_risk">Model Version</Label>
                    <Input
                      id="model_version_risk"
                      value={riskForm.model_version}
                      onChange={(e) => setRiskForm({...riskForm, model_version: e.target.value})}
                      placeholder="v1.0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="patient_data">Patient Data (JSON)</Label>
                  <Textarea
                    id="patient_data"
                    value={riskForm.patient_data}
                    onChange={(e) => setRiskForm({...riskForm, patient_data: e.target.value})}
                    placeholder='{"age": 45, "genes": ["FLT3", "NPM1"]}'
                  />
                </div>
                <Button onClick={handleRiskAssessment} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Assess Risk & Store on Blockchain
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drug" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>💊 Drug Response Ledger</CardTitle>
                <p className="text-sm text-gray-400">Log drug response predictions on blockchain</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="drug_patient">Patient ID</Label>
                    <Input
                      id="drug_patient"
                      value={drugForm.patient_id}
                      onChange={(e) => setDrugForm({...drugForm, patient_id: e.target.value})}
                      placeholder="patient_001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="drug_name">Drug Name</Label>
                    <Input
                      id="drug_name"
                      value={drugForm.drug_name}
                      onChange={(e) => setDrugForm({...drugForm, drug_name: e.target.value})}
                      placeholder="Cytarabine"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="gene_markers">Gene Markers (comma-separated)</Label>
                  <Input
                    id="gene_markers"
                    value={drugForm.gene_markers}
                    onChange={(e) => setDrugForm({...drugForm, gene_markers: e.target.value})}
                    placeholder="FLT3, NPM1"
                  />
                </div>
                <div>
                  <Label htmlFor="response_prediction">Response Prediction</Label>
                  <Select value={drugForm.response_prediction} onValueChange={(value) => setDrugForm({...drugForm, response_prediction: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select response" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="responsive">Responsive</SelectItem>
                      <SelectItem value="resistant">Resistant</SelectItem>
                      <SelectItem value="partial">Partial Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleDrugResponse} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Log Drug Response on Blockchain
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
