import { Github, Linkedin, Heart } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
			<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-center space-y-6">
					{/* Navigation Links */}
					<div className="flex items-center space-x-6">
						<Link
							href="/privacy"
							className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 
                       dark:hover:text-blue-400 transition-colors"
						>
							Privacy Policy
						</Link>
						<div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
						<Link
							href="/contact"
							className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 
                       dark:hover:text-blue-400 transition-colors"
						>
							Contact
						</Link>
					</div>

					{/* Built with love text */}
					<div className="flex items-center justify-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
						<span>Built with</span>
						<Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
						<span>by Haseeb Usman</span>
					</div>

					{/* Social Links */}
					<div className="flex items-center space-x-4">
						<a
							href="https://www.linkedin.com/in/haseeb-usman"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Open LinkedIn profile"
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full 
                     transition-colors hover:text-blue-600 dark:hover:text-blue-400"
						>
							<Linkedin className="w-5 h-5" />
						</a>
						<a
							href="https://github.com/haseeb-usman"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Open GitHub profile"
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full 
                     transition-colors hover:text-gray-900 dark:hover:text-white"
						>
							<Github className="w-5 h-5" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
