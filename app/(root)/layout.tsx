import { Topbar, Sidebar, Bottombar } from '@/components/shared'

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Topbar />
			<div className='flex pl-64'>
				<Sidebar />
				<main className='flex-1'>{children}</main>
			</div>
			<Bottombar />
		</>
	)
}
