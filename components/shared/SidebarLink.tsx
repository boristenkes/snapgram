'use client'

import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'

type SidebarLinkProps = (typeof sidebarLinks)[0]

export default function SidebarLink({ path, icon, title }: SidebarLinkProps) {
	const pathname = usePathname()
	const isActive =
		(pathname.includes(path) && path.length > 1) || pathname === path

	return (
		<li>
			<Link
				href={path}
				className={`sidebar-link ${isActive && 'bg-primary-500'}`}
			>
				<Image
					src={icon[isActive ? 'active' : 'default']}
					alt=''
					width={24}
					height={28}
				/>
				<span className={isActive ? 'font-bold' : ''}>{title}</span>
			</Link>
		</li>
	)
}
