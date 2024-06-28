import Avatar from '@/components/avatar'
import SidebarLink from '@/components/shared/sidebar/sidebar-link'
import { sidebarLinks } from '@/constants'
import auth from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import LogoutButton from './logout-button'

export default async function Sidebar() {
	const { user } = await auth()

	return (
		<aside className='shrink-0 h-screen w-full max-w-fit sticky top-0 left-0 z-40 bg-neutral-800 border-r-2 border-r-neutral-700 hidden | md:block xl:max-w-64'>
			<div className='h-full flex flex-col gap-11 py-12 px-6 overflow-y-auto custom-scrollbar'>
				<Link href='/'>
					{/* dekstop logo */}
					<Image
						src='/assets/logo-text.svg'
						alt='Snapgram logo'
						width={171}
						height={36}
						priority
						className='hidden xl:block'
					/>
					{/* mobile logo */}
					<Image
						src='/assets/logo.svg'
						alt='Snapgram logo'
						width={30}
						height={30}
						priority
						className='mx-auto xl:hidden'
					/>
				</Link>
				<Link
					href={`/profile/${user?.username}`}
					className='flex gap-2.5 items-center'
				>
					<Avatar
						url={user?.image}
						width={54}
						height={54}
					/>
					<div className='flex-1 hidden xl:block'>
						<p className='text-lg break-keep flex items-center gap-1'>
							<strong className='text-ellipsis overflow-hidden whitespace-nowrap max-w-36'>
								{user?.name}
							</strong>
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
					<ul className='h-full flex flex-col gap-2'>
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
									height={24}
								/>
								<span className='sr-only xl:not-sr-only'>Logout</span>
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
