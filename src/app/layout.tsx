import type { Metadata } from 'next'
import { Geist_Mono, Manrope } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-code',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ManageIt',
  description: 'Task management application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
