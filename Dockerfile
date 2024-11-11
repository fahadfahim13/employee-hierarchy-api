# Stage 1: Build
FROM node:18-alpine AS builder

# Install dependencies required for bcrypt
RUN apk add --no-cache python3 make g++ 

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Install necessary tools
RUN apk add --no-cache bash postgresql-client python3 make g++

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy built application and source files (needed for migration generation)
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/tsconfig.json ./
COPY --from=builder /usr/src/app/nest-cli.json ./

# Create migrations directory
RUN mkdir -p src/migrations

# Copy the startup script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

# Use the startup script as entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]