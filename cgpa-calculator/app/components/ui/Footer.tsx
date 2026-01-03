import { Github, Linkedin, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className="bg-stone-900 text-white">
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row items-center justify-between gap-8">
					{/* Logo & Description */}
					<div className="flex flex-col items-center md:items-start gap-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
								<GraduationCap className="w-5 h-5 text-white" />
							</div>
							<span className="font-bold text-lg">UAF Calculator</span>
						</div>
						<p className="text-stone-400 text-sm text-center md:text-left max-w-xs">
							Calculate your CGPA instantly with our tool designed for UAF students.
						</p>
					</div>

					{/* Links */}
					<div className="flex items-center gap-8">
						<Link
							href="/privacy"
							className="text-sm text-stone-400 hover:text-white transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/contact"
							className="text-sm text-stone-400 hover:text-white transition-colors"
						>
							Contact
						</Link>
					</div>

					{/* Social Links */}
					<div className="flex items-center gap-3">
						<a
							href="https://www.linkedin.com/in/haseeb-usman"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Open LinkedIn profile"
							className="w-10 h-10 rounded-full bg-stone-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
						>
							<Linkedin className="w-5 h-5" />
						</a>
						<a
							href="https://github.com/hasebusman"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Open GitHub profile"
							className="w-10 h-10 rounded-full bg-stone-800 hover:bg-primary-500 flex items-center justify-center transition-colors"
						>
							<Github className="w-5 h-5" />
						</a>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 pt-8 border-t border-stone-800 text-center">
					<p className="text-sm text-stone-500">
						Built by{' '}
						<a 
							href="https://www.linkedin.com/in/haseeb-usman" 
							target="_blank" 
							rel="noopener noreferrer"
							className="text-primary-400 hover:text-primary-300 transition-colors"
						>
							Haseeb Usman
						</a>
						{' '}• © {new Date().getFullYear()} All rights reserved
					</p>
				</div>
			</div>
		</footer>
	)
}
