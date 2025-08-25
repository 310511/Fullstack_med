FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY codezilla_spider/backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory
COPY codezilla_spider/backend/ ./backend/

# Copy environment setup
COPY codezilla_spider/create_env.py .

# Set environment variables
ENV PYTHONPATH=/app/backend
ENV PORT=8000

# Expose port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
