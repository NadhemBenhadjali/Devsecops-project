#!/usr/bin/env bash
set -euo pipefail

echo "==> Semgrep SAST (OWASP + Secrets + Security Audit)"

# Hard force Semgrep home + XDG paths
export HOME="$PWD"
export SEMGREP_HOME="$PWD/.semgrep"
export XDG_CACHE_HOME="$PWD/.cache"
export XDG_CONFIG_HOME="$PWD/.config"

mkdir -p "$SEMGREP_HOME" "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME"

semgrep scan \
  --config p/security-audit \
  --config p/secrets \
  --config p/owasp-top-ten \
  --error \
  --metrics=off
