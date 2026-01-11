FROM node:20-alpine

# Keep base image packages patched
RUN set -eux; \
    apk update; \
    apk upgrade

# Ensure npm's bundled dependencies (e.g. glob/cross-spawn) include the latest security fixes
ARG NPM_VERSION=11.7.0
RUN npm install -g "npm@${NPM_VERSION}" \
  && npm --version

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code (node_modules excluded via .dockerignore)
COPY src ./src
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
