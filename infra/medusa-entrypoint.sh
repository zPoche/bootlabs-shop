#!/bin/sh
set -eu

run_medusa() {
  if [ -f /server/apps/backend/scripts/run-medusa.cjs ]; then
    node /server/apps/backend/scripts/run-medusa.cjs "$@"
  elif [ -f /server/node_modules/@medusajs/cli/cli.js ]; then
    node /server/node_modules/@medusajs/cli/cli.js "$@"
  elif [ -x /server/node_modules/.bin/medusa ]; then
    /server/node_modules/.bin/medusa "$@"
  else
    /server/apps/backend/node_modules/.bin/medusa "$@"
  fi
}

echo "Waiting for PostgreSQL..."
i=0
until node -e '
const net = require("net");
const raw = process.env.DATABASE_URL || "postgres://postgres:5432";
let host = process.env.POSTGRES_HOST || "postgres";
let port = Number(process.env.POSTGRES_PORT || 5432);
try {
  const url = new URL(raw);
  if (url.hostname) host = url.hostname;
  if (url.port) port = Number(url.port);
} catch {
  // keep defaults
}
const socket = net.connect({ host, port }, () => {
  socket.end();
  process.exit(0);
});
socket.setTimeout(2000, () => {
  socket.destroy();
  process.exit(1);
});
socket.on("error", () => process.exit(1));
'; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "PostgreSQL did not become ready in time"
    exit 1
  fi
  echo "PostgreSQL not ready yet (attempt ${i})"
  sleep 2
done

# CLI commands (migrate, exec, user) must run from the Medusa app root.
# The production process then starts from .medusa/server.
cd /server/apps/backend
echo "Running Medusa migrations..."
run_medusa db:migrate

echo "Running optional Medusa admin bootstrap..."
run_medusa exec ./src/scripts/bootstrap-admin.ts

echo "Starting Medusa..."
cd /server/apps/backend/.medusa/server
exec node /server/apps/backend/scripts/run-medusa.cjs start
