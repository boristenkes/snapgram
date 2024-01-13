'use client'

import Image from 'next/image'
import Link from 'next/link'
import ProfilePicture from '../../profile-picture'
import MenuButton from './menu-button'
import clientSession from '@/lib/client-session'
import { useEffect, useState } from 'react'
import { topbarLinks } from '@/constants'
import SidebarLink from '../sidebar/sidebar-link'
import { cn } from '@/lib/utils'
import { Button } from '../../elements'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Topbar() {
	const { user } = clientSession()
	const [isMenuOpen, setMenuOpen] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		setMenuOpen(false)
	}, [pathname])

	return (
		<header className='sticky top-0 z-50 w-screen lg:hidden'>
			<div className='flex justify-between items-center py-3 px-4 bg-neutral-800 border-b-2 border-b-neutral-700'>
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
					<Link href={`/profile/${user?.username}`}>
						<ProfilePicture
							url={user?.image}
							alt={user?.name}
							width={30}
						/>
					</Link>
					<MenuButton
						isOpen={isMenuOpen}
						setOpen={setMenuOpen}
					/>
				</div>
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
							<SidebarLink
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
