FROM python:3.14-alpine AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --user -r requirements.txt

COPY src/ ./src/

# Runner
FROM python:3.14-alpine AS runner

WORKDIR /app

COPY --from=builder /root/.local /root/.local

ENV PATH=/root/.local/bin:$PATH

# COPY .env .env
COPY src/ ./src/
COPY saved.tar.gz saved.tar.gz
COPY .env_example .env

RUN mkdir saved && tar -xzvf saved.tar.gz

CMD ["python3", "src/main.py"]

# Health check for FastAPI application
HEALTHCHECK --interval=10s --timeout=2s --retries=3 \
  CMD nc -w 1 -z 127.0.0.1 8000 || exit 1
