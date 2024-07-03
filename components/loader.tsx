import { cn } from '@/lib/utils'

type LoaderTypes = {
	size?: number
	text?: string
	className?: string
}

export default function Loader({ size = 4, text, className }: LoaderTypes) {
	return (
		<span className='flex items-center gap-3'>
			<div
				className={cn(
					`size-${size} p-1.5 aspect-square border-${
						size - 2
					} border-neutral-100 border-b-transparent rounded-full block animate-spin`,
					className
				)}
			/>
			{text && <span>{text}</span>}
		</span>
	)
}
