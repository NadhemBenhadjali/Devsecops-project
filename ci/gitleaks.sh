#!/bin/sh
set -eu

mkdir -p reports

echo "==> Gitleaks secrets scan"

# The gitleaks container may not have git metadata in some setups; '--no-git' scans the working tree.
gitleaks detect --source . --no-git --redact --report-format sarif --report-path reports/gitleaks.sarif

echo "OK: gitleaks completed (see reports/gitleaks.sarif)"
