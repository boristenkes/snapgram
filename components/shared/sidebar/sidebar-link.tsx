'use client'

import UnreadNotificationCounter from '@/components/unread-notification-counter'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type SidebarLinkProps = (typeof sidebarLinks)[0] & {
	className?: string
}

export default function SidebarLink({
	path,
	icon,
	title,
	className
}: SidebarLinkProps) {
	const pathname = usePathname()
	const isActive =
		(pathname.includes(path) && path.length > 1) || pathname === path

	return (
		<li>
			<Link
				href={path}
				className={cn(
					'flex gap-4 text-lg p-4 w-full rounded-lg font-normal hover:bg-primary-500 hover:bg-opacity-10 transition-colors duration-200 relative',
					{
						'bg-primary-500 hover:bg-opacity-100 font-bold': isActive
					},
					className
				)}
			>
				<Image
					src={icon[isActive ? 'active' : 'default']}
					alt=''
					width={24}
					height={24}
					className='w-6 h-6'
				/>
				<span className='sr-only xl:not-sr-only'>{title}</span>

				{path === '/notifications' && <UnreadNotificationCounter />}
			</Link>
		</li>
	)
}
