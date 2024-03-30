import { sidebarLinks } from '@/constants'
import SuggestedAccounts from './suggested-accounts'
import Searchbar from '@/components/search'
import Link from 'next/link'

export default function RightSidebar() {
	return (
		<aside className='sticky right-0 top-0 h-screen w-full max-w-sm border-l border-l-neutral-700 bg-neutral-800 px-6 py-14 hidden lg:flex lg:flex-col xl:max-w-md'>
			<Searchbar placeholder='Search users...' />

			<SuggestedAccounts />

			<footer className='mt-auto text-center space-y-2'>
				<p className='text-neutral-400'>
					&copy; {new Date().getFullYear()} Snapgram
				</p>

				<ul className='flex flex-wrap justify-center text-sm text-neutral-400'>
					{sidebarLinks.map((link, index) => (
						<li key={link.path}>
							<Link
								href={link.path}
								className='hover:underline hover:text-neutral-500'
							>
								{link.title}
							</Link>
							{index !== sidebarLinks.length - 1 && (
								<span className='mx-1'>&bull;</span>
							)}
						</li>
					))}
				</ul>
			</footer>
		</aside>
	)
}
