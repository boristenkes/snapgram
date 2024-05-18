import { Skeleton } from '../ui/skeleton'

type UserCardListSkeletonProps = {
	cardCount?: number
}

export default function UserCardListSkeleton({
	cardCount = 8
}: UserCardListSkeletonProps) {
	return (
		<div className='space-y-2'>
			{Array.from({ length: cardCount }, (_, index) => index).map(
				(_, index) => (
					<div
						key={index}
						className='flex items-center justify-between flex-1 p-2'
					>
						<div className='flex items-center gap-2'>
							<Skeleton className='size-10 rounded-full' />

							<div className='flex-1 space-y-1'>
								<Skeleton className='w-24 h-5 rounded-lg' />
								<Skeleton className='w-16 h-3 rounded-lg' />
							</div>
						</div>

						<Skeleton className='w-20 h-7 rounded-lg' />
					</div>
				)
			)}
		</div>
	)
}
