#!/usr/bin/env bash
set -euo pipefail

echo "==> Semgrep SAST (OWASP + Secrets + Security Audit)"

export SEMGREP_HOME="$PWD/.semgrep"

mkdir -p "$SEMGREP_HOME"

semgrep scan \
  --config p/security-audit \
  --config p/secrets \
  --config p/owasp-top-ten \
  --error \
  --metrics=off
