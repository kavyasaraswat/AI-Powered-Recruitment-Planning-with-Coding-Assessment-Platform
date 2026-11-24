# ==============================================================
# HIREGENIUS AI — AI MICROSERVICE DOCKERFILE
# Python 3.11 Slim container for NLP & Vector Embeddings
# ==============================================================

FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency requirements if present or setup minimal fastapi
COPY . .
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

EXPOSE 8000

CMD ["python", "-m", "http.server", "8000"]
