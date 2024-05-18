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
					<Skeleton
						key={index}
						className='h-[52px] w-full rounded-md'
					/>
				)
			)}
		</div>
	)
}
