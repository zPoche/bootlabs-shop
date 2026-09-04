const { spawnSync } = require("node:child_process")
const { existsSync } = require("node:fs")
const path = require("node:path")

const candidates = [
  path.resolve(__dirname, "../node_modules/@medusajs/cli/cli.js"),
  path.resolve(__dirname, "../../../node_modules/@medusajs/cli/cli.js"),
]

const cli = candidates.find((file) => existsSync(file))
if (!cli) {
  console.error(
    "Medusa CLI not found. Checked:\n" + candidates.map((file) => `  ${file}`).join("\n")
  )
  process.exit(1)
}

const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
})
process.exit(result.status ?? 1)
