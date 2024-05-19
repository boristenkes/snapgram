import { Skeleton } from '../ui/skeleton'
import ParagraphSkeleton from './paragraph'
import UserCardListSkeleton from './user-card-list'

export default function PostDetailsSkeleton() {
	return (
		<>
			{/* Desktop */}
			<div className='mb-12 aspect-[16/8] rounded-3xl bg-neutral-800 hidden lg:flex'>
				<Skeleton className='size-full flex-1 rounded-lg' />

				<div className='py-9 px-7 flex-1'>
					<div className='h-full flex flex-col mb-5'>
						<div className='flex gap-3 mb-5'>
							<Skeleton className='size-[3.125rem] rounded-full' />
							<div className='space-y-1'>
								<Skeleton className='w-28 h-5' />
								<Skeleton className='w-40 h-6' />
							</div>
						</div>

						<ParagraphSkeleton className='mb-8 pb-6 border-b border-b-neutral-600' />

						<UserCardListSkeleton cardCount={3} />

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
				</div>
			</div>

			{/* Mobile */}
			<div className='lg:hidden w-[min(35rem,100%-2rem)] mx-auto bg-neutral-800 rounded-3xl p-4'>
				<div className='flex gap-3 mt-6 mb-4'>
					<Skeleton className='size-[50px] rounded-full' />
					<div className='space-y-1'>
						<Skeleton className='w-28 h-5' />
						<Skeleton className='w-40 h-4' />
					</div>
				</div>

				<ParagraphSkeleton className='mb-8' />

				<Skeleton className='w-full aspect-square rounded-2xl' />

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
		</>
	)
}
