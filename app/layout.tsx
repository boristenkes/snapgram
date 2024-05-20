import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SessionProvider from '@/components/session-provider'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from './api/uploadthing/core'
import auth from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Snapgram',
	description:
		'Redesigned Instagram clone. Practice project built with Next.js v14 by @boristenkes on Github.'
}

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	// TODO: create loading.tsx, error.tsx... page for each route (that needs it)
	return (
		<html lang='en'>
			<SessionProvider session={session}>
				<body
					className={`${inter.className} bg-neutral-900 text-neutral-100 min-h-screen pb-20 md:pb-0`}
				>
					<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
					{children}
					<Toaster />
				</body>
			</SessionProvider>
		</html>
	)
}
