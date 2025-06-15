import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/ui/Navbar";
import { ClientLayout } from './components/layout/ClientLayout';
import { Metadata } from 'next'
import { keywords } from './utils/keywords'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: "UAF CGPA Calculator",
  title: {
    default: "UAF CGPA Calculator | Calculate Your UAF CGPA and GPA Easily",
    template: "%s | UAF CGPA Calculator"
  },
  metadataBase: new URL("https://uafcalculator.live"),
  description: "CGPA Calculator for UAF students. Calculate UAF semester GPA and CGPA instantly. Trusted by UAF students across all departments and programs.",
  keywords: keywords,
  authors: [
    {
      name: "UAF Calculator Live",
      url: "https://uafcalculator.live",
    },
  ],
  creator: "UAF Calculator Live",
  publisher: "UAF Calculator Live",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.png'
  },
  openGraph: {
    siteName: "UAF Calculator Live",
    type: 'website',
    url: 'https://uafcalculator.live',
    title: 'UAF CGPA Calculator | Fast & Accurate UAF GPA Calculator',
    description: 'Calculate your UAF CGPA and GPA instantly. Free tool for University of Agriculture Faisalabad students.',
    images: [
      {
        url: 'https://uafcalculator.live/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UAF CGPA Calculator',
      },
    ],
  },
  category: 'education',
  twitter: {
    card: 'summary_large_image',
    title: 'UAF CGPA Calculator | Fast & Accurate UAF GPA Calculator',
    description: 'Calculate your UAF CGPA and GPA instantly. Free tool for University of Agriculture Faisalabad students.',
    images: [
      {
        url: 'https://uafcalculator.live/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UAF CGPA Calculator',
      },
    ],
    site: '@uafcalculatorlive',
    creator: '@uafcalculatorlive',
  },
  robots: {
    index: true,
    follow: true,
  },
  

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <ClientLayout>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            {children}
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
