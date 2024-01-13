'use client'

import Image from 'next/image'
import Link from 'next/link'
import { bottombarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type BottombarLinkProps = (typeof bottombarLinks)[0] & {
	className?: string
}

export default function BottombarLink({
	path,
	icon,
	title,
	className
}: BottombarLinkProps) {
	const pathname = usePathname()
	const isActive =
		(pathname.includes(path) && path.length > 1) || pathname === path

	return (
		<li>
			<Link
				href={path}
				className={cn(
					'flex flex-col items-center py-2 px-2 rounded-lg text-xs gap-1',
					{
						'bg-primary-500 font-bold': isActive
					},
					className
				)}
			>
				<Image
					src={icon[isActive ? 'active' : 'default']}
					alt=''
					width={24}
					height={24}
				/>
				{title}
			</Link>
		</li>
	)
}
