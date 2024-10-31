FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY .env .env
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage to keep the production image small
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json ./

# Expose the application's port
EXPOSE 3003

CMD ["npm", "run", "start"]
