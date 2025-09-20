import type { Metadata } from 'next'
import './globals.css'
import Menu from '@/components/layout/Menu'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Professional portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Menu />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}