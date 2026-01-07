#!/bin/sh
set -eu

mkdir -p reports

echo "==> Semgrep SAST (auto rules)"
semgrep --config auto --metrics=off --sarif --output reports/semgrep.sarif

echo "OK: semgrep completed (see reports/semgrep.sarif)"
