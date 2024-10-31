FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
COPY .env .env

# Install dependencies
RUN npm ci

# Copy all source code to the container
COPY . .

# Build the application (compiles TypeScript to JavaScript)
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3002

# Run the application in production mode
CMD ["node", "dist/index.js"]
