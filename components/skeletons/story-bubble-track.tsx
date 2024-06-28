import { Skeleton } from '../ui/skeleton'

export default function StoryBubbleTrackSkeleton() {
	return (
		<div>
			<ul className='flex items-center gap-6 px-4 py-5 mb-4 md:p-10 lg:p-16'>
				{Array.from({ length: 10 }, (_, index) => index).map((_, index) => (
					<li
						key={index}
						className='relative flex-none'
					>
						<Skeleton className='size-[4.25rem] rounded-full mx-auto mb-1' />
						<Skeleton className='w-20 h-5 rounded-lg' />
					</li>
				))}
			</ul>
		</div>
	)
}
