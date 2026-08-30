#!/bin/sh
set -eu
export PORT="${PORT:-8000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
exec node /server/apps/storefront/server.js
