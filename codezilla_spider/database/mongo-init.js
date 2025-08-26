// MongoDB Initialization Script for MedChain
// This script creates collections and indexes for document-based data

// Create database
db = db.getSiblingDB('medchain');

// Create collections with validation
db.createCollection("voice_medicine_sessions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "sessionId", "startTime"],
      properties: {
        userId: { bsonType: "string" },
        sessionId: { bsonType: "string" },
        startTime: { bsonType: "date" },
        endTime: { bsonType: "date" },
        interactions: { bsonType: "array" },
        summary: { bsonType: "object" }
      }
    }
  }
});

db.createCollection("medicine_knowledge_base", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["medicineName", "category", "activeIngredients"],
      properties: {
        medicineName: { bsonType: "string" },
        category: { bsonType: "string" },
        activeIngredients: { bsonType: "array" },
        dosageForms: { bsonType: "array" },
        sideEffects: { bsonType: "array" },
        contraindications: { bsonType: "array" },
        interactions: { bsonType: "array" },
        lastUpdated: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("ai_conversations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "conversationId", "messages"],
      properties: {
        userId: { bsonType: "string" },
        conversationId: { bsonType: "string" },
        messages: { bsonType: "array" },
        context: { bsonType: "object" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("ml_model_versions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["modelName", "version", "modelPath"],
      properties: {
        modelName: { bsonType: "string" },
        version: { bsonType: "string" },
        modelPath: { bsonType: "string" },
        accuracy: { bsonType: "double" },
        trainingData: { bsonType: "object" },
        deploymentDate: { bsonType: "date" },
        isActive: { bsonType: "bool" }
      }
    }
  }
});

db.createCollection("user_preferences", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        userId: { bsonType: "string" },
        theme: { bsonType: "string" },
        language: { bsonType: "string" },
        notifications: { bsonType: "object" },
        dashboardLayout: { bsonType: "object" },
        lastUpdated: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for better performance
db.voice_medicine_sessions.createIndex({ "userId": 1, "startTime": -1 });
db.voice_medicine_sessions.createIndex({ "sessionId": 1 }, { unique: true });

db.medicine_knowledge_base.createIndex({ "medicineName": 1 }, { unique: true });
db.medicine_knowledge_base.createIndex({ "category": 1 });
db.medicine_knowledge_base.createIndex({ "activeIngredients": 1 });

db.ai_conversations.createIndex({ "userId": 1, "createdAt": -1 });
db.ai_conversations.createIndex({ "conversationId": 1 }, { unique: true });

db.ml_model_versions.createIndex({ "modelName": 1, "version": 1 }, { unique: true });
db.ml_model_versions.createIndex({ "isActive": 1 });

db.user_preferences.createIndex({ "userId": 1 }, { unique: true });

// Insert sample medicine knowledge base data
db.medicine_knowledge_base.insertMany([
  {
    medicineName: "Amoxicillin",
    category: "Antibiotics",
    activeIngredients: ["Amoxicillin trihydrate"],
    dosageForms: ["Capsule", "Tablet", "Suspension", "Injection"],
    sideEffects: [
      "Nausea",
      "Diarrhea",
      "Rash",
      "Yeast infection"
    ],
    contraindications: [
      "Allergy to penicillin",
      "Mononucleosis"
    ],
    interactions: [
      "Probenecid",
      "Allopurinol",
      "Oral contraceptives"
    ],
    lastUpdated: new Date()
  },
  {
    medicineName: "Paracetamol",
    category: "Analgesics",
    activeIngredients: ["Acetaminophen"],
    dosageForms: ["Tablet", "Suspension", "Suppository", "Injection"],
    sideEffects: [
      "Liver damage (high doses)",
      "Allergic reactions"
    ],
    contraindications: [
      "Severe liver disease",
      "Alcohol dependence"
    ],
    interactions: [
      "Warfarin",
      "Alcohol"
    ],
    lastUpdated: new Date()
  },
  {
    medicineName: "Insulin",
    category: "Diabetes Care",
    activeIngredients: ["Human insulin"],
    dosageForms: ["Injection"],
    sideEffects: [
      "Hypoglycemia",
      "Weight gain",
      "Injection site reactions"
    ],
    contraindications: [
      "Hypoglycemia",
      "Allergy to insulin"
    ],
    interactions: [
      "Corticosteroids",
      "Beta-blockers",
      "ACE inhibitors"
    ],
    lastUpdated: new Date()
  }
]);

// Insert sample ML model version
db.ml_model_versions.insertOne({
  modelName: "medicine_recommendation",
  version: "1.0.0",
  modelPath: "/models/medicine_recommendation_v1.0.0.pkl",
  accuracy: 0.89,
  trainingData: {
    samples: 10000,
    features: 50,
    lastTrainingDate: new Date()
  },
  deploymentDate: new Date(),
  isActive: true
});

print("MongoDB initialization completed successfully!");


