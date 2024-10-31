FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY .env.production .env.production

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/package*.json ./

# Expose the Next.js port
EXPOSE 3000

CMD ["npm", "run", "start"]
