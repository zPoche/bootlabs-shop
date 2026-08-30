import type { Metadata } from "next"
import { DM_Sans, Syne } from "next/font/google"
import { siteContent } from "@/content/site"
import "./globals.css"

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
})

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: siteContent.meta.title,
  description: siteContent.meta.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  )
}
