import { Skeleton } from '../ui/skeleton'

export default function FeedSkeleton() {
	return (
		<div className='mx-auto space-y-10'>
			{Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
				<Skeleton
					key={index}
					className='w-[min(37.5rem,100%-2rem)] min-h-[800px] rounded-2xl mx-auto'
				/>
			))}
		</div>
	)
}
