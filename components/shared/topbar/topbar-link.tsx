'use client'

import Image from 'next/image'
import Link from 'next/link'
import { topbarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type TopbarLinkProps = (typeof topbarLinks)[0] & {
	className?: string
}

export default function TopbarLink({
	path,
	icon,
	title,
	className
}: TopbarLinkProps) {
	const pathname = usePathname()
	const isActive =
		(pathname.includes(path) && path.length > 1) || pathname === path

	return (
		<li>
			<Link
				href={path}
				className={cn(
					'flex gap-4 text-lg p-4 w-full rounded-lg font-normal hover:bg-primary-500 hover:bg-opacity-10 transition-colors duration-200',
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
