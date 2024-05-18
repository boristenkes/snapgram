import { Skeleton } from '../ui/skeleton'
import ParagraphSkeleton from './paragraph'

export default function FeedSkeleton() {
	return (
		<div className='mx-auto space-y-10'>
			{Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
				<div
					key={index}
					className='bg-[#09090A] w-[min(37.5rem,100%-2rem)] py-5 px-4 sm:py-9 sm:px-7 mx-auto rounded-2xl border-2 border-neutral-700'
				>
					<div className='flex justify-between items-start mb-5'>
						<div className='flex gap-3'>
							<Skeleton className='size-[3.125rem] rounded-full' />

							<div className='space-y-1'>
								<Skeleton className='w-28 h-5 rounded-lg' />
								<Skeleton className='w-36 h-5 rounded-lg' />
							</div>
						</div>
					</div>

					<ParagraphSkeleton className='mb-8' />

					<Skeleton className='max-w-[33.875rem] w-full h-[32.5rem] rounded-2xl' />

					<div className='flex items-center justify-between w-full my-6'>
						<div className='flex items-center gap-7'>
							<Skeleton className='w-12 h-7 rounded-lg' />
							<Skeleton className='w-12 h-7 rounded-lg' />
							<Skeleton className='w-12 h-7 rounded-lg' />
						</div>
						<Skeleton className='w-12 h-7 rounded-lg' />
					</div>

					<div className='flex items-center gap-3'>
						<Skeleton className='size-10 rounded-full' />
						<Skeleton className='h-12 flex items-center rounded-lg flex-1' />
					</div>
				</div>
			))}
		</div>
	)
}
