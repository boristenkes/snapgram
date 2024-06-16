import PopularTagsSkeleton from '@/components/skeletons/popular-tags'
import PostListSkeleton from '@/components/skeletons/post-list'
import { Skeleton } from '@/components/ui/skeleton'

export default function ExploreLoading() {
	return (
		<div
			className='my-8 sm:my-16'
			aria-label='Explore page loading...'
		>
			<Skeleton className='w-80 h-10 rounded-lg mx-auto mb-8' />
			<Skeleton className='w-[min(41rem,100%-2rem)] h-[52px] rounded-2xl mx-auto' />
			<PopularTagsSkeleton />
			<div className='w-[min(62.5rem,100%-2rem)] mx-auto'>
				<Skeleton className='w-[209px] h-9 rounded-lg mt-12 sm:mt-20' />
				<PostListSkeleton />
			</div>
		</div>
	)
}
