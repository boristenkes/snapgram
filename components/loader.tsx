import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'

type LoaderTypes = {
	size?: number
	text?: string
	className?: string
}

export default function Loader({ size = 16, text, className }: LoaderTypes) {
	return (
		<span className={cn('flex items-center gap-3', className)}>
			<Loader2Icon
				size={size}
				className='animate-spin'
			/>
			{/* <div
				className={cn(
					`size-${size} p-1.5 aspect-square border-${
						size - 2
					} border-neutral-100 border-b-transparent rounded-full block animate-spin`,
					className
				)}
			/> */}
			{text && <span>{text}</span>}
		</span>
	)
}
