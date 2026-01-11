#!/bin/sh
set -eu

# Usage:
#   REG_USER=... REG_PASS=... IMAGE_NAMESPACE=nadhembenhadjali ./ci/docker_build.sh
#   REG_USER=... REG_PASS=... ./ci/docker_push.sh
#
# Optional:
#   PUSH_LATEST=1   -> also tags/pushes :latest for both images
#   SKIP_LOGIN=1    -> skip docker login (if your runner already logged in)

if [ -f ".ci/image_tags.env" ]; then
  # shellcheck disable=SC1091
  . ".ci/image_tags.env"
fi

: "${BACKEND_IMAGE:?BACKEND_IMAGE is missing (run ci/docker_build.sh first)}"
: "${FRONTEND_IMAGE:?FRONTEND_IMAGE is missing (run ci/docker_build.sh first)}"

REGISTRY_HOST="$(echo "$BACKEND_IMAGE" | cut -d/ -f1)"

if [ "${SKIP_LOGIN:-0}" != "1" ]; then
  : "${REG_USER:?REG_USER is required for docker login}"
  : "${REG_PASS:?REG_PASS is required for docker login}"

  echo "==> Docker login to $REGISTRY_HOST as $REG_USER"
  echo "$REG_PASS" | docker login "$REGISTRY_HOST" -u "$REG_USER" --password-stdin >/dev/null
fi

require_local_image() {
  img="$1"
  if ! docker image inspect "$img" >/dev/null 2>&1; then
    echo "ERROR: image not found locally: $img"
    echo "Hint: run ./ci/docker_build.sh first (or make sure the build produced this tag)."
    exit 2
  fi
}

push_one() {
  img="$1"
  require_local_image "$img"
  echo "==> Pushing: $img"
  docker push "$img"

  if [ "${PUSH_LATEST:-0}" = "1" ]; then
    repo="${img%:*}"
    latest="${repo}:latest"
    echo "==> Tagging + pushing latest: $latest"
    docker tag "$img" "$latest"
    docker push "$latest"
  fi
}

push_one "$BACKEND_IMAGE"
push_one "$FRONTEND_IMAGE"

echo "OK: pushed"
echo "  BACKEND_IMAGE=$BACKEND_IMAGE"
echo "  FRONTEND_IMAGE=$FRONTEND_IMAGE"
