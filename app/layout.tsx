import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SessionProvider from '@/components/SessionProvider'
import { getServerSession } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Snapgram'
}

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getServerSession()

	return (
		<html lang='en'>
			<SessionProvider session={session}>
				<body className={`${inter.className} bg-neutral-900 text-neutral-100`}>
					{children}
					<Toaster />
				</body>
			</SessionProvider>
		</html>
	)
}
