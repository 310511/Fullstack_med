#!/bin/bash

echo "🚀 Deploying Promoter Validation System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Build and start services
echo "📦 Building and starting services..."
docker-compose -f docker-compose.promoter.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check API health
API_HEALTH=$(curl -s http://localhost:8002/health 2>/dev/null)
if [[ $API_HEALTH == *"healthy"* ]]; then
    echo "✅ Promoter API is healthy"
else
    echo "❌ Promoter API health check failed"
fi

# Check database connection
DB_STATUS=$(docker-compose -f docker-compose.promoter.yml exec -T postgres pg_isready -U postgres 2>/dev/null)
if [[ $DB_STATUS == *"accepting connections"* ]]; then
    echo "✅ PostgreSQL database is ready"
else
    echo "❌ PostgreSQL database connection failed"
fi

echo "🎉 Deployment completed!"
echo ""
echo "📋 Service URLs:"
echo "   Promoter API: http://localhost:8002"
echo "   API Docs: http://localhost:8002/docs"
echo "   PostgreSQL: localhost:5433"
echo "   Redis: localhost:6380"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.promoter.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.promoter.yml down"
echo "   Restart: docker-compose -f docker-compose.promoter.yml restart"


