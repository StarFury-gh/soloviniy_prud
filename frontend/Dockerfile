FROM node:22-alpine AS build

WORKDIR /app

EXPOSE 80

COPY ./package*.json .

RUN npm ci

COPY . .

RUN chmod +x node_modules/.bin/*
RUN npm run build
RUN node compress.js

FROM fholzer/nginx-brotli:v1.28.0

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf

# Health check for Nginx
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1
