import QueryProvider from '@/components/query-provider'
import SessionProvider from '@/components/session-provider'
import auth from '@/lib/auth'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from './api/uploadthing/core'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Snapgram',
	description:
		'Redesigned Instagram clone. Practice project built with Next.js v14 by @boristenkes on Github.',
	keywords: [
		'next.js',
		'next.js 14',
		'instagram clone',
		'mongodb',
		'snapgram',
		'redesigned instagram clone',
		'server actions',
		'uploadthing'
	]
}

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	return (
		<html lang='en'>
			<SessionProvider session={session}>
				<QueryProvider>
					<body
						className={`${inter.className} flex flex-col bg-neutral-900 text-neutral-100 min-h-screen pb-20 md:pb-0`}
					>
						<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
						{children}
						<Toaster />
					</body>
				</QueryProvider>
			</SessionProvider>
		</html>
	)
}
