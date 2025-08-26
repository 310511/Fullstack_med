import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Pill, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  User,
  FileText
} from 'lucide-react';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedDate: string;
  status: 'active' | 'completed' | 'discontinued' | 'expired';
  refills: number;
  refillsRemaining: number;
  instructions: string;
  sideEffects: string[];
  interactions: string[];
  patientId: string;
  patientName: string;
}

export function PrescriptionManager() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: '1',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      prescribedBy: 'Dr. Sarah Johnson',
      prescribedDate: '2024-01-15',
      status: 'active',
      refills: 3,
      refillsRemaining: 2,
      instructions: 'Take in the morning with or without food. Monitor blood pressure regularly.',
      sideEffects: ['Dizziness', 'Dry cough', 'Fatigue'],
      interactions: ['NSAIDs', 'Lithium'],
      patientId: '1',
      patientName: 'John Doe'
    },
    {
      id: '2',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '30 days',
      prescribedBy: 'Dr. Michael Chen',
      prescribedDate: '2024-01-10',
      status: 'active',
      refills: 2,
      refillsRemaining: 1,
      instructions: 'Take with meals to reduce stomach upset. Start with one tablet daily.',
      sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
      interactions: ['Alcohol', 'Contrast dye'],
      patientId: '1',
      patientName: 'John Doe'
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'discontinued':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleAddPrescription = (prescription: Omit<Prescription, 'id'>) => {
    const newPrescription: Prescription = {
      ...prescription,
      id: Date.now().toString()
    };
    setPrescriptions([...prescriptions, newPrescription]);
    setShowAddDialog(false);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setPrescriptions(prescriptions.map(p => p.id === prescription.id ? prescription : p));
    setEditingPrescription(null);
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    filterStatus === 'all' || p.status === filterStatus
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Prescription Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage patient medications and prescriptions</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Prescription</DialogTitle>
              <DialogDescription>Create a new prescription for the patient</DialogDescription>
            </DialogHeader>
            <AddPrescriptionForm onSubmit={handleAddPrescription} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div>
              <Label>Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prescriptions</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto">
              <Badge variant="outline">
                Total: {prescriptions.length}
              </Badge>
              <Badge variant="outline" className="ml-2">
                Active: {prescriptions.filter(p => p.status === 'active').length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <div className="grid gap-4">
        {filteredPrescriptions.map(prescription => (
          <Card key={prescription.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{prescription.medication}</CardTitle>
                    <CardDescription>
                      {prescription.dosage} • {prescription.frequency} • {prescription.prescribedBy}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(prescription.status)}>
                    {prescription.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPrescription(prescription)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePrescription(prescription.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">{prescription.duration}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Refills Remaining</Label>
                  <p className="text-sm">{prescription.refillsRemaining} of {prescription.refills}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Prescribed Date</Label>
                  <p className="text-sm">{prescription.prescribedDate}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <Label className="text-sm font-medium">Instructions</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{prescription.instructions}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Side Effects</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prescription.sideEffects.map((effect, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Drug Interactions</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prescription.interactions.map((interaction, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {interaction}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingPrescription && (
        <Dialog open={!!editingPrescription} onOpenChange={() => setEditingPrescription(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Prescription</DialogTitle>
              <DialogDescription>Update prescription information</DialogDescription>
            </DialogHeader>
            <EditPrescriptionForm 
              prescription={editingPrescription} 
              onSubmit={handleEditPrescription}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Add Prescription Form Component
function AddPrescriptionForm({ onSubmit }: { onSubmit: (prescription: Omit<Prescription, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    prescribedBy: '',
    prescribedDate: new Date().toISOString().split('T')[0],
    status: 'active' as const,
    refills: 0,
    refillsRemaining: 0,
    instructions: '',
    sideEffects: [] as string[],
    interactions: [] as string[],
    patientId: '1',
    patientName: 'John Doe'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Medication</Label>
          <Input
            value={formData.medication}
            onChange={(e) => setFormData({...formData, medication: e.target.value})}
            placeholder="Medication name"
            required
          />
        </div>
        <div>
          <Label>Dosage</Label>
          <Input
            value={formData.dosage}
            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
            placeholder="e.g., 10mg"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Frequency</Label>
          <Input
            value={formData.frequency}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            placeholder="e.g., Once daily"
            required
          />
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            placeholder="e.g., 30 days"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Prescribed By</Label>
          <Input
            value={formData.prescribedBy}
            onChange={(e) => setFormData({...formData, prescribedBy: e.target.value})}
            placeholder="Doctor name"
            required
          />
        </div>
        <div>
          <Label>Prescribed Date</Label>
          <Input
            type="date"
            value={formData.prescribedDate}
            onChange={(e) => setFormData({...formData, prescribedDate: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Total Refills</Label>
          <Input
            type="number"
            value={formData.refills}
            onChange={(e) => setFormData({...formData, refills: parseInt(e.target.value), refillsRemaining: parseInt(e.target.value)})}
            min="0"
            required
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Instructions</Label>
        <Textarea
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          placeholder="Special instructions for the patient"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Add Prescription</Button>
      </div>
    </form>
  );
}

// Edit Prescription Form Component
function EditPrescriptionForm({ 
  prescription, 
  onSubmit 
}: { 
  prescription: Prescription; 
  onSubmit: (prescription: Prescription) => void;
}) {
  const [formData, setFormData] = useState(prescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Medication</Label>
          <Input
            value={formData.medication}
            onChange={(e) => setFormData({...formData, medication: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Dosage</Label>
          <Input
            value={formData.dosage}
            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Frequency</Label>
          <Input
            value={formData.frequency}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Refills Remaining</Label>
          <Input
            type="number"
            value={formData.refillsRemaining}
            onChange={(e) => setFormData({...formData, refillsRemaining: parseInt(e.target.value)})}
            min="0"
            max={formData.refills}
            required
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Instructions</Label>
        <Textarea
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Update Prescription</Button>
      </div>
    </form>
  );
}


