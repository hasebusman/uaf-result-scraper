import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn about how we protect your privacy and handle your information at UAF CGPA Calculator.',
  openGraph: {
    title: 'Privacy Policy | UAF CGPA Calculator',
    description: 'Our commitment to protecting your privacy and personal information.'
  }
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
