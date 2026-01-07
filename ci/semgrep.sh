#!/bin/bash
set -e

echo "==> Semgrep SAST (OWASP + Secrets + Security Audit)"

docker run --rm -v "$PWD:/src" returntocorp/semgrep:1.82.0 \
  semgrep scan \
  --config p/security-audit \
  --config p/secrets \
  --config p/owasp-top-ten \
  --error
