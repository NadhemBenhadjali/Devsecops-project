#!/bin/sh
set -eu

. .ci/image_tags.env

DEPLOY_ENV="${DEPLOY_ENV:-none}"
KUBECONFIG_FILE="${KUBECONFIG_FILE:-}"
K8S_NAMESPACE="${K8S_NAMESPACE:-consumesafe}"

if [ -z "$KUBECONFIG_FILE" ]; then
  echo "ERROR: KUBECONFIG_FILE not provided (use Jenkins file credential)" >&2
  exit 2
fi

export KUBECONFIG="$KUBECONFIG_FILE"

echo "==> Creating namespace (idempotent)"
kubectl apply -f k8s/base/namespace.yaml

echo "==> Applying base manifests"
kubectl apply -k k8s/overlays/${DEPLOY_ENV}

echo "==> Updating images"
kubectl -n "$K8S_NAMESPACE" set image deployment/consumesafe-backend backend="$BACKEND_IMAGE" --record
kubectl -n "$K8S_NAMESPACE" set image deployment/consumesafe-frontend frontend="$FRONTEND_IMAGE" --record

echo "==> Waiting for rollout"
kubectl -n "$K8S_NAMESPACE" rollout status deployment/consumesafe-backend --timeout=180s
kubectl -n "$K8S_NAMESPACE" rollout status deployment/consumesafe-frontend --timeout=180s

echo "OK: deployed to ${DEPLOY_ENV}"
