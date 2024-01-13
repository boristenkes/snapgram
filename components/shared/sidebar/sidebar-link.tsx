'use client'

import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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
				// className={`sidebar-link${isActive ? ' active' : ''}`}
				className={cn(
					'flex gap-4 text-lg p-4 rounded-lg font-normal hover:bg-primary-500 hover:bg-opacity-10 transition-colors duration-200',
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
					height={28}
				/>
				{title}
			</Link>
		</li>
	)
}
