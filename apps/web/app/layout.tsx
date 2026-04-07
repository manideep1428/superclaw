import { Geist_Mono, Manrope, JetBrains_Mono, Geist } from "next/font/google"
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <AuthKitProvider>
            {children}
          </AuthKitProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
