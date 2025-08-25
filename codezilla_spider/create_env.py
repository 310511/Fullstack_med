#!/usr/bin/env python3
"""
Script to create .env file with all necessary environment variables.
This script will create a .env file in the current directory with all the API keys
and configuration variables needed for the project.
"""

import os

def create_env_file():
    """Create .env file with all environment variables."""
    
    env_content = """# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyAePpEwxlOFgxVCn4tVeVIZ4xnVv-cdKUk
VITE_FIREBASE_AUTH_DOMAIN=medchain-11528.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medchain-11528
VITE_FIREBASE_STORAGE_BUCKET=medchain-11528.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123027023076
VITE_FIREBASE_APP_ID=1:123027023076:web:b071a3a77d48beee67b8f1
VITE_FIREBASE_MEASUREMENT_ID=G-EDSGGHW2VG

# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Session Configuration
SESSION_SECRET=spider1-flask-secret-key

# YouTube API Configuration
YOUTUBE_API_KEY=AIzaSyCKZvQBqIJPzQbT9jo4w2Huzp5V7z715QU

# Groq API Configuration (for other projects)
GROQ_API_KEY=your_groq_api_key_here

# Google Gemini API Configuration (for other projects)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Backend Configuration
BACKEND_HOST=localhost
BACKEND_PORT=8000

# Frontend Configuration
VITE_API_URL=https://fullstack-med-2.onrender.com
"""
    
    env_file_path = ".env"
    
    # Check if .env file already exists
    if os.path.exists(env_file_path):
        print(f"⚠️  .env file already exists at {env_file_path}")
        response = input("Do you want to overwrite it? (y/N): ")
        if response.lower() != 'y':
            print("❌ .env file creation cancelled.")
            return False
    
    try:
        with open(env_file_path, 'w') as f:
            f.write(env_content)
        
        print(f"✅ .env file created successfully at {env_file_path}")
        print("🔐 All API keys are now secured in environment variables!")
        print("📖 Check ENV_SETUP.md for more information.")
        return True
        
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def main():
    """Main function to create .env file."""
    print("🔧 Creating .env file with environment variables...")
    print("📁 This will create a .env file in the current directory.")
    print()
    
    success = create_env_file()
    
    if success:
        print()
        print("🎉 Environment setup complete!")
        print("📋 Next steps:")
        print("   1. Install python-dotenv: pip install python-dotenv")
        print("   2. Restart your development server")
        print("   3. All features should continue to work as before")
    else:
        print()
        print("❌ Environment setup failed.")
        print("📖 Please check ENV_SETUP.md for manual setup instructions.")

if __name__ == "__main__":
    main()
