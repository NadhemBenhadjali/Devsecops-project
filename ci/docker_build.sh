#!/bin/sh
set -eu

# Some CI agents ship the Docker CLI without the buildx plugin.
# In that case, forcing BuildKit can emit noisy errors. Fall back to the classic builder.
if ! docker buildx version >/dev/null 2>&1; then
  export DOCKER_BUILDKIT=0
fi

SHORTSHA="$(cat .git/shortsha 2>/dev/null || git rev-parse --short HEAD)"

REGISTRY="${REGISTRY:-ghcr.io}"
IMAGE_NAMESPACE="${IMAGE_NAMESPACE:-replace-me}"

BACKEND_IMAGE="$REGISTRY/$IMAGE_NAMESPACE/consumesafe-backend:$SHORTSHA"
FRONTEND_IMAGE="$REGISTRY/$IMAGE_NAMESPACE/consumesafe-frontend:$SHORTSHA"

FRONTEND_API_URL="${FRONTEND_API_URL:-http://consumesafe-backend:5050}"

mkdir -p .ci
cat > .ci/image_tags.env <<EOF
SHORTSHA=$SHORTSHA
BACKEND_IMAGE=$BACKEND_IMAGE
FRONTEND_IMAGE=$FRONTEND_IMAGE
EOF

echo "==> Building backend image: $BACKEND_IMAGE"
docker build --pull --no-cache -t "$BACKEND_IMAGE" -f backend/Dockerfile ./backend

echo "==> Building frontend image: $FRONTEND_IMAGE"

# Prefer a production Dockerfile if present
if [ -f "frontend/Dockerfile.prod" ]; then
  docker build \
    -f frontend/Dockerfile.prod \
    --build-arg VITE_API_URL="$FRONTEND_API_URL" \
    -t "$FRONTEND_IMAGE" \
    ./frontend
else
  docker build -t "$FRONTEND_IMAGE" ./frontend
fi

echo "OK: images built"
