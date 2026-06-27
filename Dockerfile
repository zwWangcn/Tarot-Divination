# Stage 1: Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Run the production build (compiles client assets and bundles server.ts to dist/server.cjs)
RUN npm run build

# Stage 2: Production stage
FROM node:20-slim
WORKDIR /app

# Ensure production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application assets from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000 (Cloud Run will route traffic to this port)
EXPOSE 3000

# Start the full-stack server
CMD ["node", "dist/server.cjs"]
