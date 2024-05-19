import { Skeleton } from '../ui/skeleton'

export default function TopPostsSkeleton() {
	return (
		<div className='space-y-6'>
			{Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
				<Skeleton
					key={index}
					className='size-[284px] aspect-square'
				/>
			))}
		</div>
	)
}
