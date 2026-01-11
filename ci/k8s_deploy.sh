#!/bin/sh
set -eu

. .ci/image_tags.env

DEPLOY_ENV="${DEPLOY_ENV:-none}"
KUBECONFIG_FILE="${KUBECONFIG_FILE:-}"
K8S_NAMESPACE="${K8S_NAMESPACE:-consumesafe}"

# Optional: override kube-apiserver URL (useful when kubeconfig has kubernetes.docker.internal)
# Example: https://127.0.0.1:6443 or https://<control-plane-ip>:6443
KUBE_API_SERVER="${KUBE_API_SERVER:-}"

if [ -z "$KUBECONFIG_FILE" ]; then
  echo "ERROR: KUBECONFIG_FILE not provided (use Jenkins file credential)" >&2
  exit 2
fi

if [ "$DEPLOY_ENV" = "none" ]; then
  echo "ERROR: DEPLOY_ENV=none. Refusing to deploy." >&2
  exit 2
fi

TMP_KUBECONFIG="$(mktemp)"
trap 'rm -f "$TMP_KUBECONFIG"' EXIT
cp "$KUBECONFIG_FILE" "$TMP_KUBECONFIG"
export KUBECONFIG="$TMP_KUBECONFIG"

current_server="$(kubectl config view --raw --minify -o jsonpath='{.clusters[0].cluster.server}')"
echo "==> kube-apiserver from kubeconfig: ${current_server}"

if [ -n "$KUBE_API_SERVER" ]; then
  cluster_name="$(kubectl config view --raw --minify -o jsonpath='{.clusters[0].name}')"
  echo "==> Overriding kube-apiserver to: ${KUBE_API_SERVER} (cluster: ${cluster_name})"
  kubectl config set-cluster "$cluster_name" --server="$KUBE_API_SERVER" >/dev/null
  current_server="$KUBE_API_SERVER"
fi

# Basic DNS sanity check (if hostname, not IP)
host="$(printf "%s" "$current_server" | sed -n 's#^https\?://\([^:/]*\).*#\1#p')"
if [ -n "$host" ] && ! printf "%s" "$host" | grep -Eq '^[0-9.]+$'; then
  if command -v getent >/dev/null 2>&1; then
    if ! getent hosts "$host" >/dev/null 2>&1; then
      echo "ERROR: cannot resolve kube-apiserver host: $host" >&2
      echo "Fix options:" >&2
      echo "  - Update the kubeconfig credential to use a reachable server URL, OR" >&2
      echo "  - Set KUBE_API_SERVER to a reachable URL (e.g. https://127.0.0.1:6443), OR" >&2
      echo "  - Add /etc/hosts entry for $host on the Jenkins node." >&2
      exit 2
    fi
  fi
fi

echo "==> Checking cluster connectivity"
kubectl cluster-info >/dev/null

echo "==> Creating namespace (idempotent)"
kubectl apply --validate=false -f k8s/base/namespace.yaml

echo "==> Applying base manifests"
kubectl apply --validate=false -k "k8s/overlays/${DEPLOY_ENV}"

echo "==> Updating images"
kubectl -n "$K8S_NAMESPACE" set image deployment/consumesafe-backend backend="$BACKEND_IMAGE" --record
kubectl -n "$K8S_NAMESPACE" set image deployment/consumesafe-frontend frontend="$FRONTEND_IMAGE" --record

echo "==> Waiting for rollout"
kubectl -n "$K8S_NAMESPACE" rollout status deployment/consumesafe-backend --timeout=180s
kubectl -n "$K8S_NAMESPACE" rollout status deployment/consumesafe-frontend --timeout=180s

echo "OK: deployed to ${DEPLOY_ENV}"
