export const tokens = {
  name: "bootlabs",
  background: "#e8eef2",
  foreground: "#102027",
  muted: "#4a5b64",
  accent: "#0b6b5a",
} as const

export type BootlabsTokenName = keyof typeof tokens
