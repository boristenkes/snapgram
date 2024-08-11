import { Bottombar, Sidebar, Topbar } from '@/components/shared'
import { TooltipProvider } from '@/components/ui/tooltip'
import auth from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function RootLayout({
	children,
	dialog
}: {
	children: React.ReactNode
	dialog: React.ReactNode
}) {
	const session = await auth()

	if (!session?.user) {
		redirect('/login')
	} else if (!session?.user.onboarded) {
		redirect('/onboarding')
	}

	return (
		<TooltipProvider>
			<Topbar />
			<div className='flex flex-1'>
				<Sidebar />
				<div className='flex-1'>{children}</div>
			</div>
			<div>{dialog}</div>
			<Bottombar />
		</TooltipProvider>
	)
}
