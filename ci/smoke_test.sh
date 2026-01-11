#!/bin/sh
set -eu

K8S_NAMESPACE="${K8S_NAMESPACE:-consumesafe}"

if [ -n "${BACKEND_URL:-}" ]; then
  echo "==> Smoke: backend /"
  curl -fsSL "$BACKEND_URL/" | head -c 500 || true
else
  echo "SKIP: BACKEND_URL not set"
fi

if [ -n "${FRONTEND_URL:-}" ]; then
  echo "==> Smoke: frontend /"
  curl -fsSL "$FRONTEND_URL/" | head -c 500 || true
else
  echo "SKIP: FRONTEND_URL not set"
fi

echo "OK: smoke test completed"
