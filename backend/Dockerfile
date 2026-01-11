FROM node:20-bookworm-slim

# Keep OS packages patched, and install runtime deps (Prisma needs libssl in slim images)
RUN set -eux; \
  apt-get update; \
  apt-get -y upgrade; \
  apt-get install -y --no-install-recommends openssl ca-certificates; \
  rm -rf /var/lib/apt/lists/*

# Ensure npm's bundled dependencies (e.g. glob/cross-spawn) include the latest security fixes
# Pin to a known-good version to keep builds deterministic.
ARG NPM_VERSION=11.7.0
RUN npm install -g "npm@${NPM_VERSION}" \
  && npm --version

WORKDIR /app

# Create non-root user for security (Debian/Ubuntu style)
RUN groupadd --system appgroup \
  && useradd --system --gid appgroup --home-dir /home/appuser --create-home appuser

COPY package*.json ./

# Install deps (include dev deps for prisma generate)
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

# Remove dev deps after build step
RUN npm prune --omit=dev

COPY src ./src

RUN chown -R appuser:appgroup /app

USER appuser
ENV NODE_ENV=production

EXPOSE 5050
CMD ["node", "src/server.js"]
