import { Topbar, Sidebar, Bottombar } from '@/components/shared'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getCurrentUser()

	if (!session?.user) {
		console.log('!!! redirected from RootLayout because of !session?.user')
		redirect('/login')
	} else if (!session?.user.onboarded) {
		console.log(
			'!!! redirected from RootLayout because of !session?.user.onboarded'
		)
		redirect('/onboarding')
	}

	return (
		<>
			<Topbar />
			<div className='flex lg:pl-64'>
				<Sidebar />
				{/* TODO: remove this min-h-... */}
				<main className='flex-1 min-h-[calc(100vh-60px-84px)]'>{children}</main>
			</div>
			<Bottombar />
		</>
	)
}
