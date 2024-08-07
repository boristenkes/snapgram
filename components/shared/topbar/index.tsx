'use client'

import Avatar from '@/components/avatar'
import { Button } from '@/components/elements'
import Searchbar from '@/components/search'
import { topbarLinks } from '@/constants'
import useAuth from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import MenuButton from './menu-button'
import TopbarLink from './topbar-link'

export default function Topbar() {
	const { user: currentUser } = useAuth()
	const [isMenuOpen, setMenuOpen] = useState(false)
	const [searchExpanded, setSearchExpanded] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		setMenuOpen(false)
	}, [pathname])

	return (
		<header className='sticky top-0 z-40 w-full | md:hidden'>
			<div className='flex justify-between items-center py-3 px-4 bg-neutral-800 border-b-2 border-b-neutral-700'>
				{searchExpanded && (
					<Searchbar
						wrapperClassName='w-full'
						placeholder='Search users...'
						autoFocus
						onBlur={() => setTimeout(() => setSearchExpanded(false), 0)}
					/>
				)}

				{!searchExpanded && (
					<>
						<Link href='/'>
							<Image
								src='/assets/logo-text.svg'
								alt='Snapgram logo'
								width={131}
								height={28}
								priority
							/>
						</Link>
						<div className='flex items-center gap-3'>
							<button
								aria-label='Toggle search bar'
								onClick={() => setSearchExpanded(true)}
							>
								<SearchIcon
									size={24}
									color='#5C5C7B'
								/>
							</button>
							<Link href={`/profile/${currentUser?.username}`}>
								<Avatar
									url={currentUser?.image}
									alt={currentUser?.name}
									width={30}
								/>
							</Link>
							<MenuButton
								isOpen={isMenuOpen}
								setOpen={setMenuOpen}
							/>
						</div>
					</>
				)}
			</div>
			<div
				className={cn(
					'bg-neutral-700/80 fixed top-[60px] inset-x-0 p-4 pb-8 -z-10 transition-transform duration-500 backdrop-blur-3xl',
					{ '-translate-y-full': !isMenuOpen }
				)}
			>
				<nav>
					<ul>
						{topbarLinks.map(link => (
							<TopbarLink
								key={link.path}
								{...link}
							/>
						))}
					</ul>
				</nav>
				<Button
					stretch
					className='bg-semantic-danger border-semantic-danger mt-4'
					onClick={() => signOut()}
				>
					<Image
						src='/assets/icons/logout-neutral.svg'
						alt=''
						width={24}
						height={24}
					/>
					Logout
				</Button>
			</div>
		</header>
	)
}
