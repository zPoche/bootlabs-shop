#!/bin/sh
set -eu

echo "Waiting for PostgreSQL..."
i=0
until node -e '
const net = require("net");
const url = new URL(process.env.DATABASE_URL);
const socket = net.connect({ host: url.hostname, port: Number(url.port || 5432) }, () => {
  socket.end();
});
socket.setTimeout(2000, () => { socket.destroy(); process.exit(1); });
socket.on("error", () => process.exit(1));
'; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "PostgreSQL did not become ready in time"
    exit 1
  fi
  sleep 2
done

cd /server/apps/medusa
echo "Running Medusa migrations..."
pnpm exec medusa db:migrate
echo "Starting Medusa..."
exec pnpm start
