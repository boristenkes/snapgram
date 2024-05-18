import FeedSkeleton from '@/components/skeletons/feed'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
	return (
		<div className='flex'>
			<div className='flex-1'>
				<div className='py-4 lg:py-10' />
				<FeedSkeleton />
			</div>

			<Skeleton className='sticky top-0 right-0 h-screen w-full max-w-sm hidden lg:block xl:max-w-md' />
		</div>
	)
}
