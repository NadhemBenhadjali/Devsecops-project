FROM node:20-alpine

# Install OpenSSL for Prisma (required for Alpine Linux)
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package files
COPY package*.json ./

# Install dependencies (includes Prisma)
RUN npm ci --omit=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy only source code (not node_modules thanks to .dockerignore)
COPY src ./src

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5050

# Start server
CMD ["node", "src/server.js"]
