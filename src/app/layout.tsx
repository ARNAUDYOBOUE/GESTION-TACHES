import './globals.css'
import SessionWrapper from '@/components/SessionWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-screen bg-gray-50">
        <SessionWrapper>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}