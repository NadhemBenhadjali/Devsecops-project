#!/bin/sh
set -eu

mkdir -p reports

TRIVY_CACHE_DIR="${TRIVY_CACHE_DIR:-$PWD/.trivy-cache}"
TRIVY_IGNORE_FILE="${TRIVY_IGNORE_FILE:-$PWD/.trivyignore}"
mkdir -p "$TRIVY_CACHE_DIR"

# Try to load tags if the file exists
if [ -f ".ci/image_tags.env" ]; then
  . .ci/image_tags.env
else
  # Fallback: compute tags (no stash needed)
  SHORT_SHA="$(printf '%s' "${GIT_COMMIT:-}" | cut -c1-7)"
  REGISTRY="${REGISTRY:-ghcr.io}"
  IMAGE_NAMESPACE="${IMAGE_NAMESPACE:-replace-me}"

  BACKEND_IMAGE="${REGISTRY}/${IMAGE_NAMESPACE}/consumesafe-backend:${SHORT_SHA}"
  FRONTEND_IMAGE="${REGISTRY}/${IMAGE_NAMESPACE}/consumesafe-frontend:${SHORT_SHA}"
fi

: "${BACKEND_IMAGE:?BACKEND_IMAGE not set}"
: "${FRONTEND_IMAGE:?FRONTEND_IMAGE not set}"

export TRIVY_DB_REPOSITORY="public.ecr.aws/aquasecurity/trivy-db"
export TRIVY_JAVA_DB_REPOSITORY="public.ecr.aws/aquasecurity/trivy-java-db"

echo "==> Pre-download Trivy DB (cached in $TRIVY_CACHE_DIR)"
trivy --cache-dir "$TRIVY_CACHE_DIR" image --download-db-only --no-progress

echo "==> Trivy scan: backend ($BACKEND_IMAGE)"
trivy --cache-dir "$TRIVY_CACHE_DIR" image --image-src docker --scanners vuln --no-progress \
  --ignorefile "$TRIVY_IGNORE_FILE" --ignore-unfixed \
  --severity HIGH,CRITICAL --exit-code 1 "$BACKEND_IMAGE" > reports/trivy-backend.txt

echo "==> Trivy scan: frontend ($FRONTEND_IMAGE)"
trivy --cache-dir "$TRIVY_CACHE_DIR" image --image-src docker --scanners vuln --no-progress \
  --ignorefile "$TRIVY_IGNORE_FILE" --ignore-unfixed \
  --severity HIGH,CRITICAL --exit-code 1 "$FRONTEND_IMAGE" > reports/trivy-frontend.txt

echo "OK: trivy scans passed"
