import { Topbar, Sidebar, Bottombar } from '@/components/shared'

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
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
