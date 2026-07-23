import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

export const metadata = {
  title: 'YASS TRAINING — Formation Football Elite',
  description: 'Plateforme dédiée à la formation football.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}