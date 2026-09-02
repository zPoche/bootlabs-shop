#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

echo "==> install"
pnpm install --frozen-lockfile

echo "==> lint"
pnpm lint

echo "==> typecheck"
pnpm typecheck

echo "==> test"
pnpm test

echo "==> build"
pnpm build

echo "Phase 0 local checks passed."
