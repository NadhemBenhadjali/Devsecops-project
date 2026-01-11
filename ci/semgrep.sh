#!/usr/bin/env bash
set -euo pipefail

echo "==> Semgrep SAST (OWASP + Secrets + Security Audit)"

# Go to repo root (so paths are stable)
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR"

# Reports directory (Jenkins can archive this)
REPORT_DIR="${REPORT_DIR:-$ROOT_DIR/reports}"
mkdir -p "$REPORT_DIR"

# -------------------------------------------------------------------
# Fix: In Jenkins docker containers, HOME can be "/" (not writable),
# which makes Semgrep try to create "/.semgrep" or "//.semgrep".
# We force HOME and SEMGREP_USER_HOME to a writable location.
# -------------------------------------------------------------------
if [ -z "${HOME:-}" ] || [ "$HOME" = "/" ] || [ ! -w "$HOME" ]; then
  if [ -n "${WORKSPACE:-}" ] && [ -w "${WORKSPACE:-}" ]; then
    export HOME="$WORKSPACE"
  else
    export HOME="/tmp"
  fi
fi

# Always force Semgrep to use a writable user home dir
export SEMGREP_USER_HOME="${SEMGREP_USER_HOME:-$HOME/.semgrep}"
mkdir -p "$SEMGREP_USER_HOME"

# What to scan (default: whole repo)
TARGETS=("$@")
if [ ${#TARGETS[@]} -eq 0 ]; then
  TARGETS=(".")
fi

# Semgrep configs
CONFIGS=(
  "p/security-audit"
  "p/secrets"
  "p/owasp-top-ten"
)

# Decide how to run Semgrep:
# - If semgrep exists: run directly (good for Jenkins semgrep container)
# - Else if docker exists: run semgrep via docker image (good locally)
SEMGREP_IMAGE="${SEMGREP_IMAGE:-returntocorp/semgrep:1.82.0}"

if command -v semgrep >/dev/null 2>&1; then
  RUNNER=(semgrep)
elif command -v docker >/dev/null 2>&1; then
  RUNNER=(
    docker run --rm
    -e HOME=/tmp
    -e SEMGREP_USER_HOME=/tmp/.semgrep
    -v "$ROOT_DIR:/src"
    -w /src
    "$SEMGREP_IMAGE"
    semgrep
  )
else
  echo "ERROR: Neither 'semgrep' nor 'docker' is available to run Semgrep."
  exit 127
fi

# Run Semgrep (SARIF output for artifacts + fail build on findings with --error)
set +e
"${RUNNER[@]}" scan \
  --config "${CONFIGS[0]}" \
  --config "${CONFIGS[1]}" \
  --config "${CONFIGS[2]}" \
  --metrics=off \
  --sarif -o "$REPORT_DIR/semgrep.sarif" \
  --error \
  "${TARGETS[@]}"
rc=$?
set -e

if [ $rc -ne 0 ]; then
  echo "Semgrep exited with code $rc"
  echo "SARIF report: $REPORT_DIR/semgrep.sarif"
fi

exit $rc
