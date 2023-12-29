import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Snapgram'
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={`${inter.className} bg-neutral-900 text-neutral-100`}>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
