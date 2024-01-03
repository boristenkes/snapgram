import Image from 'next/image'
import ProfilePicture from '../ProfilePicture'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import SidebarLink from './SidebarLink'
import { getCurrentUser } from '@/lib/session'
import { LogoutButton } from '../LogoutButton'

export default async function Sidebar() {
	const { user } = await getCurrentUser()

	return (
		<aside className='h-screen w-64 fixed top-0 left-0 z-10 bg-neutral-800 border-r-2 border-r-neutral-700 hidden lg:block'>
			<div className='h-full flex flex-col gap-11 py-12 px-6'>
				<Link href='/'>
					<Image
						src='/assets/logo-text.svg'
						alt='Snapgram logo'
						width={171}
						height={36}
						priority
					/>
				</Link>
				<Link
					href={`/profile/${user?.username}`}
					className='flex gap-2.5 items-center'
				>
					<ProfilePicture
						url={user?.image}
						width={54}
						height={54}
					/>
					<div className='flex-1'>
						<p className='text-lg font-bold break-keep flex items-center gap-1'>
							{user?.name}
							{user?.verified && (
								<Image
									src='/assets/icons/verified.svg'
									alt='Verified'
									width={16}
									height={17}
								/>
							)}
						</p>
						<p className='text-sm text-neutral-500 text-ellipsis overflow-hidden whitespace-nowrap max-w-36'>
							@{user.username}
						</p>
					</div>
				</Link>
				<nav className='h-full'>
					<ul className='h-full flex flex-col gap-2 overflow-y-auto no-scrollbar'>
						{sidebarLinks.map(link => (
							<SidebarLink
								key={link.path}
								{...link}
							/>
						))}

						<li className='mt-auto relative'>
							<LogoutButton
								ghost
								stretch
								className='sidebar-link | justify-start'
							>
								<Image
									src='/assets/icons/logout-primary.svg'
									alt=''
									width={24}
									height={28}
								/>
								Logout
							</LogoutButton>
						</li>
						<SidebarLink
							path='/settings'
							icon={{
								active: '/assets/icons/settings-neutral.svg',
								default: '/assets/icons/settings-primary.svg'
							}}
							title='Settings'
						/>
					</ul>
				</nav>
			</div>
		</aside>
	)
}
