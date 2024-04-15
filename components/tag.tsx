import { cn } from '@/lib/utils'
import Link from 'next/link'

type TagProps = React.ComponentProps<'div'> & {
	tag: string
	paramKey?: string
}

export default function Tag({ tag, paramKey = 'search', className }: TagProps) {
	return (
		<Link
			href={{
				pathname: '/explore',
				query: {
					[paramKey]: tag
				}
			}}
			replace
			className={cn('text-neutral-500 font-semibold', className)}
		>
			#{tag}
		</Link>
	)
}
