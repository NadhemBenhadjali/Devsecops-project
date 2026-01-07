#!/bin/sh
set -eu

. .ci/image_tags.env

REGISTRY="${REGISTRY:-ghcr.io}"

echo "==> Login to registry: $REGISTRY"
echo "$REG_PASS" | docker login "$REGISTRY" -u "$REG_USER" --password-stdin

echo "==> Pushing: $BACKEND_IMAGE"
docker push "$BACKEND_IMAGE"

echo "==> Pushing: $FRONTEND_IMAGE"
docker push "$FRONTEND_IMAGE"

echo "OK: images pushed"
