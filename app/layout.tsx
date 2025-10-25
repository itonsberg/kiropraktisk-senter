import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import "./globals.css"
import "mapbox-gl/dist/mapbox-gl.css"

export const metadata: Metadata = {
  title: "Kiropraktisk Senter – Kiropraktor & Massør i Tønsberg",
  description:
    "Profesjonell kiropraktikk og massasje i Tønsberg siden 1981. Vi behandler ryggsmerter, nakkebesvær, og muskel-skjelettplager med moderne utstyr og erfarne terapeuter.",
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body className="font-sans antialiased" style={{ fontFamily: "'TikTok Sans', system-ui, -apple-system, sans-serif" }}>
        <ThemeProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
