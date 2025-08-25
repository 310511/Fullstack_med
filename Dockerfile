FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY codezilla_spider/backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY codezilla_spider/backend/ ./backend/

# Copy environment setup
COPY codezilla_spider/create_env.py .

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Expose port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
