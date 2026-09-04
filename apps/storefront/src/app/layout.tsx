import { getBaseURL } from "@lib/util/env"
import { shopContent } from "@lib/content"
import { Archivo, JetBrains_Mono, Space_Grotesk } from "next/font/google"
import { Metadata, Viewport } from "next"
import "styles/globals.css"

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "800",
  style: "italic",
  display: "swap",
})

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
})

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: shopContent.meta.title,
    template: "%s · Bootlabs Shop",
  },
  description: shopContent.meta.description,
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0B0D",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      data-mode="dark"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
