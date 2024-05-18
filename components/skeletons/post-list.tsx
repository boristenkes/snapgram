import { Skeleton } from '../ui/skeleton'

type PostListSkeletonProps = {
	postCount?: number
}

export default function PostListSkeleton({
	postCount = 6
}: PostListSkeletonProps) {
	return (
		<div
			className='grid grid-cols-3 mt-14 gap-2 w-full'
			aria-label='Loading posts...'
		>
			{Array.from({ length: postCount }, (_, index) => index).map(
				(_, index) => (
					<Skeleton
						key={index}
						className='max-w-[330px] w-full aspect-square'
					/>
				)
			)}
		</div>
	)
}
