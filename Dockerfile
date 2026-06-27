# ==========================================
# Stage 1: Build the application (builder)
# ==========================================
FROM node:20-slim AS builder

# Set the working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the frontend and bundle the backend server using esbuild
RUN npm run build

# ==========================================
# Stage 2: Production runner
# ==========================================
FROM node:20-slim AS runner

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set the working directory
WORKDIR /app

# Copy package definitions to install production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy static assets and built distribution files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Ensure the uploads directory exists and has correct ownership for the non-root node user
RUN mkdir -p public/uploads && chown -R node:node /app

# Use the secure, non-root user provided by the official Node image
USER node

# Expose the application port
EXPOSE 3000

# Define a lightweight healthcheck using Node's native fetch API (v18+)
# This ensures zero additional container bloat while monitoring server liveness.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3000) + '/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the application
CMD ["npm", "start"]
