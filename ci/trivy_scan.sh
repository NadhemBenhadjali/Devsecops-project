#!/bin/sh
set -eu

. .ci/image_tags.env

mkdir -p reports

echo "==> Trivy scan: backend"
trivy image --no-progress --severity HIGH,CRITICAL --exit-code 1 "$BACKEND_IMAGE" > reports/trivy-backend.txt

echo "==> Trivy scan: frontend"
trivy image --no-progress --severity HIGH,CRITICAL --exit-code 1 "$FRONTEND_IMAGE" > reports/trivy-frontend.txt

echo "OK: trivy scans passed"
