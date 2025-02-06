import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { ClientLayout } from './components/ClientLayout';
import { Metadata } from 'next'
import { keywords } from './utils/keywords'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "UAF CGPA Calculator | Calculate Your University GPA Easily",
    template: "%s | UAF CGPA Calculator"
  },
  description: "CGPA Calculator for University of Agriculture Faisalabad (UAF) students. Calculate UAF semester GPA and CGPA instantly. Trusted by UAF students across all departments and programs.",
  keywords: keywords,
  icons: {
    icon: '/icon.png'
  },
  openGraph: {
    title: 'UAF CGPA Calculator | Fast & Accurate University GPA Calculator',
    description: 'Calculate your UAF CGPA instantly. Free tool for University of Agriculture Faisalabad students.',
    images: [
      {
        url: 'https://uafcalculator.live/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UAF CGPA Calculator',
      },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
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
