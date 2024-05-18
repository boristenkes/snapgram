import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'

export default function ParagraphSkeleton({
	className
}: {
	className?: string
}) {
	return (
		<div className={cn('w-paragraph space-y-2', className)}>
			<Skeleton className='w-full h-4 rounded-lg' />
			<Skeleton className='w-full h-4 rounded-lg' />
			<Skeleton className='w-4/5 h-4 rounded-lg' />
		</div>
	)
}
