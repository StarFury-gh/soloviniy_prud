# Stage 1: Build stage
FROM python:3.11-slim AS builder

ARG HF_ACCESS_TOKEN
ENV HF_TOKEN=$HF_ACCESS_TOKEN

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
        --index-url https://download.pytorch.org/whl/cpu \
        --extra-index-url https://pypi.org/simple \
        -r requirements.txt

# Stage 2: Production stage
FROM python:3.11-slim AS production

ARG HF_ACCESS_TOKEN
ENV HF_TOKEN=$HF_ACCESS_TOKEN
ENV HF_ACCESS_TOKEN=$HF_ACCESS_TOKEN

WORKDIR /app

# Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy installed packages from builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY src/ ./src/
COPY models/ ./models/
COPY translations.db .

# Save model - используем Python скрипт с токеном из ENV
RUN python3 src/saver.py

# Set permissions
RUN chown -R appuser:appgroup /app && \
    chmod +x /usr/local/bin/*

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/docs')" || exit 1

# Run the application
CMD ["python3", "src/main.py"]