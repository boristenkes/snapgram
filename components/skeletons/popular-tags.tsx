import { Skeleton } from '../ui/skeleton'

type PopularTagsSkeletonProps = {
	tagCount?: number
}

export default function PopularTagsSkeleton({
	tagCount = 4
}: PopularTagsSkeletonProps) {
	return (
		<div
			className='flex justify-center gap-3 mt-9 text-sm sm:text-base'
			aria-label='Loading popular tags...'
		>
			{Array.from({ length: tagCount }, (_, index) => index).map((_, index) => (
				<Skeleton
					key={index}
					className='rounded-full w-24 h-12'
				/>
			))}
		</div>
	)
}
