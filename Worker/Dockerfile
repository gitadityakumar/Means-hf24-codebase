FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Install Python and other dependencies using apk
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Create python symlink
RUN ln -sf python3 /usr/bin/python

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

# Install Python in the production stage as well if needed at runtime
RUN apk add --no-cache python3 && \
    ln -sf python3 /usr/bin/python

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json ./

# Run the application in production mode
CMD ["npm", "run", "start"]