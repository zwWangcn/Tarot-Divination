# === Stage 1: Build Stage ===
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package configuration files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files and build
COPY . .
RUN npm run build

# === Stage 2: Run Stage ===
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies (since server packages are marked external in esbuild)
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000 (which is the default PORT, though Cloud Run dynamically overrides this)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
