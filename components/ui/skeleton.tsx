import { cn } from '@/lib/utils'

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				'animate-pulse rounded-md bg-neutral-600/50 dark:bg-neutral-50/10',
				className
			)}
			{...props}
		/>
	)
}

export { Skeleton }
