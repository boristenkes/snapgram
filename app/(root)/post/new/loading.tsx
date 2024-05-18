import FormSkeleton from '@/components/skeletons/form'
import TopPostsSkeleton from '@/components/skeletons/top-posts'
import { Skeleton } from '@/components/ui/skeleton'

export default function NewPostLoading() {
	return (
		<div
			className='flex'
			aria-label='New post page loading...'
		>
			<div className='my-10 lg:my-20 mx-auto flex-1 max-w-xl w-full px-8'>
				<Skeleton className='w-72 h-10 mb-8' />
				<FormSkeleton />
			</div>

			<div className='sticky top-0 right-0 h-screen w-96 py-20 px-11 border-l-2 border-l-neutral-700 hidden lg:block xl:max-w-md'>
				<Skeleton className='size-[130px] rounded-full mb-6 mx-auto' />
				<Skeleton className='w-[188px] h-9 rounded-lg mx-auto mb-3' />
				<Skeleton className='w-[134px] h-6 rounded-lg mx-auto' />

				<div className='mt-14'>
					<Skeleton className='w-48 h-8 mb-6 rounded-lg' />
					<TopPostsSkeleton />
				</div>
			</div>
			{/* <Skeleton className='sticky top-0 right-0 h-screen w-96 hidden lg:block xl:max-w-md' /> */}
		</div>
	)
}
