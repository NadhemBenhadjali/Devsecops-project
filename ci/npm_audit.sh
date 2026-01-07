#!/bin/sh
set -eu

echo "==> npm audit (backend)"
(cd backend && npm audit --audit-level=high)

echo "==> npm audit (frontend)"
(cd frontend && npm audit --audit-level=high)

echo "OK: npm audit passed"
