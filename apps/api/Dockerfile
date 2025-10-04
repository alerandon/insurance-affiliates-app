FROM node:22-alpine
RUN apk add --no-cache procps
WORKDIR /app/api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
