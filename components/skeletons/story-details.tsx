import { Skeleton } from '../ui/skeleton'

export default function StoryDetailsSkeleton() {
	return (
		<div className='relative mx-auto px-4 py-5 w-[26.25rem] h-[46.25rem] max-h-[80vh] rounded-xl overflow-hidden bg-neutral-700'>
			<div className='absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-neutral-800/50 to-transparent' />

			<div className='absolute top-5 left-4 right-4'>
				<div className='flex items-center gap-1 mb-2'>
					<Skeleton className='flex-1 h-1 rounded-3xl' />
					<Skeleton className='flex-1 h-1 rounded-3xl' />
					<Skeleton className='flex-1 h-1 rounded-3xl' />
				</div>

				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Skeleton className='size-[1.875rem] rounded-full' />
						<Skeleton className='w-28 h-6 rounded-lg' />
						<Skeleton className='w-7 h-6 rounded-lg' />
					</div>

					<Skeleton className='size-9 rounded-lg' />
				</div>
			</div>
		</div>
	)
}
