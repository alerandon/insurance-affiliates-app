FROM node:22-alpine
WORKDIR /app

# Instalar dependencias del sistema para compilar módulos nativos
RUN apk add --no-cache python3 make g++

# Copiar archivos de configuración de workspace
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/types/package*.json ./packages/types/

# Copiar código fuente
COPY apps/web ./apps/web
COPY packages/types ./packages/types

# Cambiar al directorio de web
WORKDIR /app/apps/web

EXPOSE 5173

# Script de inicio que instala dependencias si no existen y luego inicia vite
CMD ["/bin/sh", "-c", "cd /app && npm install && npm install --no-save @rollup/rollup-linux-x64-musl lightningcss-linux-x64-musl && cd /app/apps/web && npm run dev -- --host"]
