import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the UAF CGPA Calculator team. We\'d love to hear from you and help with any questions.',
  openGraph: {
    title: 'Contact Us | UAF CGPA Calculator',
    description: 'Get in touch with the UAF CGPA Calculator team.'
  }
}

export default function ContactLayout({
  children,
}: {  
  children: React.ReactNode
}) {
  return children
}
