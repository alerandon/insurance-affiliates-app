FROM node:22-alpine
RUN apk add --no-cache procps
WORKDIR /app

# Copiar archivos de configuración de workspace
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package*.json ./packages/types/

# Instalar dependencias del workspace
RUN npm install

# Copiar código fuente
COPY apps/api ./apps/api
COPY packages/types ./packages/types

# Cambiar al directorio de api
WORKDIR /app/apps/api

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
