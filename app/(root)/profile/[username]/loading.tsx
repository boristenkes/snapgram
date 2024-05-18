import ParagraphSkeleton from '@/components/skeletons/paragraph'
import PostListSkeleton from '@/components/skeletons/post-list'
import { Skeleton } from '@/components/ui/skeleton'

export default function UserLoading() {
	return (
		<div className='w-[min(65.5rem,100%-2rem)] my-10 mx-auto px-4 | large:my-20 large:px-16'>
			{/* Desktop */}
			<div className='hidden sm:block'>
				<div className='flex gap-4 | large:gap-8'>
					<Skeleton className='size-20 rounded-full large:size-40' />
					<div className='flex-1'>
						<div className='hidden items-center gap-12 mb-2 | small:flex'>
							<Skeleton className='w-[222px] h-10 rounded-lg' />
							<div className='flex gap-3'>
								<Skeleton className='w-20 h-9 rounded-lg' />
								<Skeleton className='w-20 h-9 rounded-lg' />
							</div>
						</div>
						<Skeleton className='w-[85px] h-7 rounded-lg hidden | small:block' />
						<div className='flex items-center justify-around w-full font-medium mb-6 text-center | large:text-xl small:mt-6 small:justify-start small:gap-10'>
							<Skeleton className='w-20 h-7 rounded-lg' />
							<Skeleton className='w-20 h-7 rounded-lg' />
							<Skeleton className='w-20 h-7 rounded-lg' />
						</div>
						<ParagraphSkeleton />
					</div>
				</div>
				<Skeleton className='w-[668px] h-[52px] rounded-lg mt-16' />
				<PostListSkeleton />
			</div>

			{/* Mobile */}
			<div className='my-2 sm:hidden'>
				<div className='flex items-start justify-between mb-6'>
					<Skeleton className='size-20 rounded-full flex-none' />

					<div className='flex items-center justify-around w-full'>
						<Skeleton className='w-14 h-11 rounded-lg' />
						<Skeleton className='w-16 h-11 rounded-lg' />
						<Skeleton className='w-14 h-11 rounded-lg' />
					</div>
				</div>

				<Skeleton className='w-24 h-6 rounded-lg mb-1' />

				<Skeleton className='w-20 h-5 rounded-lg mb-2' />

				<ParagraphSkeleton />

				<div className='my-3 flex items-center gap-3'>
					<Skeleton className='w-full h-9 rounded-lg' />
					<Skeleton className='w-full h-9 rounded-lg' />
				</div>

				<Skeleton className='w-44 h-[52px] rounded-lg mt-16' />

				<PostListSkeleton />
			</div>
		</div>
	)
}
