FROM postgres:15

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=soloviniy_prud

COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

# Health check for PostgreSQL
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD pg_isready -U postgres || exit 1
