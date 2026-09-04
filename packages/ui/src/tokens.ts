export const tokens = {
  name: "bootlabs",
  background: "#0A0B0D",
  foreground: "#F4F6F5",
  muted: "#9AA0AE",
  dim: "#6E7480",
  accent: "#7C5CFF",
  accentSoft: "#CFC4FF",
  ok: "#7CFFC4",
  surface: "#0E0F17",
} as const

export type BootlabsTokenName = keyof typeof tokens
