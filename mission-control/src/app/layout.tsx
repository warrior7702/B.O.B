import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B.O.B. Mission Control',
  description: 'Bot On Board - First Baptist Church Arlington',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}