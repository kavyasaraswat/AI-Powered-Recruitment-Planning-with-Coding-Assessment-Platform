# ==============================================================
# HIREGENIUS AI — PRODUCTION BACKEND DOCKERFILE
# Multi-stage optimized build for minimal image size & security
# ==============================================================

# STAGE 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source and build TypeScript to dist
COPY src ./src
RUN npm run build

# STAGE 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Create upload directory with non-root ownership
RUN mkdir -p uploads && chown -R node:node /app

# Run as unprivileged node user
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
