import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  AlertTriangle, 
  Shield, 
  Calendar,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react';

interface PatientProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  height: string;
  weight: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    expiryDate: string;
  };
  allergies: string[];
  conditions: string[];
  medications: string[];
}

export function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<PatientProfile>({
    id: '1',
    name: 'John Doe',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    bloodType: 'O+',
    height: '175 cm',
    weight: '70 kg',
    contact: {
      phone: '+1-555-0123',
      email: 'john.doe@email.com',
      address: '123 Main St, City, State 12345'
    },
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1-555-0124',
      relationship: 'Spouse'
    },
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS123456',
      groupNumber: 'GRP789',
      expiryDate: '2024-12-31'
    },
    allergies: ['Penicillin', 'Peanuts', 'Shellfish'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril', 'Metformin', 'Aspirin']
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to API
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Patient Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage patient information and medical history</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button onClick={handleSave} variant="default">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={patient.name}
                      onChange={(e) => setPatient({...patient, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={patient.dateOfBirth}
                      onChange={(e) => setPatient({...patient, dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={patient.gender}
                      onChange={(e) => setPatient({...patient, gender: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      value={patient.bloodType}
                      onChange={(e) => setPatient({...patient, bloodType: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={patient.height}
                      onChange={(e) => setPatient({...patient, height: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={patient.weight}
                      onChange={(e) => setPatient({...patient, weight: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={patient.contact.phone}
                      onChange={(e) => setPatient({
                        ...patient, 
                        contact: {...patient.contact, phone: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patient.contact.email}
                      onChange={(e) => setPatient({
                        ...patient, 
                        contact: {...patient.contact, email: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={patient.contact.address}
                  onChange={(e) => setPatient({
                    ...patient, 
                    contact: {...patient.contact, address: e.target.value}
                  })}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="mr-1">
                      {allergy}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Allergy
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-blue-500" />
                  Medical Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="mr-1">
                      {condition}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Condition
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.medications.map((medication, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {medication}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Insurance Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">Insurance Provider</Label>
                    <Input
                      id="provider"
                      value={patient.insurance.provider}
                      onChange={(e) => setPatient({
                        ...patient, 
                        insurance: {...patient.insurance, provider: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      value={patient.insurance.policyNumber}
                      onChange={(e) => setPatient({
                        ...patient, 
                        insurance: {...patient.insurance, policyNumber: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="groupNumber">Group Number</Label>
                    <Input
                      id="groupNumber"
                      value={patient.insurance.groupNumber}
                      onChange={(e) => setPatient({
                        ...patient, 
                        insurance: {...patient.insurance, groupNumber: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={patient.insurance.expiryDate}
                      onChange={(e) => setPatient({
                        ...patient, 
                        insurance: {...patient.insurance, expiryDate: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={patient.emergencyContact.name}
                      onChange={(e) => setPatient({
                        ...patient, 
                        emergencyContact: {...patient.emergencyContact, name: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={patient.emergencyContact.phone}
                      onChange={(e) => setPatient({
                        ...patient, 
                        emergencyContact: {...patient.emergencyContact, phone: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={patient.emergencyContact.relationship}
                      onChange={(e) => setPatient({
                        ...patient, 
                        emergencyContact: {...patient.emergencyContact, relationship: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


