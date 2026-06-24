FROM python:3.14-alpine AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --user -r requirements.txt

COPY src/ ./src/

FROM python:3.14-alpine AS runner

WORKDIR /app

COPY --from=builder /root/.local /root/.local

ENV PATH=/root/.local/bin:$PATH

COPY .env .env
COPY src/ ./src/

CMD ["python3", "src/main.py"]

# Health check for FastAPI application
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1
