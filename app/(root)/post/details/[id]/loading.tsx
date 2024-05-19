import PostDetailsSkeleton from '@/components/skeletons/post-details'
import PostListSkeleton from '@/components/skeletons/post-list'
import { Skeleton } from '@/components/ui/skeleton'

export default function PostDetailsLoading() {
	return (
		<div className='w-[min(68.75rem,100%-2rem)] mx-auto'>
			<Skeleton className='w-28 h-11 rounded-lg my-5 sm:mt-20 sm:mb-10' />
			<PostDetailsSkeleton />
			<div className='my-14 border-t border-neutral-600'>
				<Skeleton className='w-96 h-9 rounded-lg my-14 sm:text-3xl' />
				<PostListSkeleton />
			</div>
		</div>
	)
}
