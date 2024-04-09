import { Inter } from 'next/font/google'
import './globals.css'
import NavigationBar from '@/components/NavigationBar';
import Loader from '@/components/Loader';
import { lazy, Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StockRem',
  description: 'Next Generation Stock Recommendation Platform!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo.svg" sizes="any" />
      <body className={inter.className}>
        <NavigationBar />
        <Suspense fallback={<Loader isLoading={true} />}>
        <div className="content">
      {children}
    </div>
        </Suspense>
      </body>
    </html>
  )
}