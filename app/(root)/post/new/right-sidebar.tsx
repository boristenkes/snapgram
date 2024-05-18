import Avatar from '@/components/avatar'
import auth from '@/lib/auth'
import { cn } from '@/lib/utils'
import TopPosts from './top-posts'
import { Suspense } from 'react'
import TopPostsSkeleton from '@/components/skeletons/top-posts'

export default async function RigthSidebar({
	className = ''
}: {
	className?: string
}) {
	const { user: currentUser } = await auth()

	return (
		<aside
			className={cn(
				'sticky top-0 right-0 max-h-screen h-full max-w-96 overflow-y-auto custom-scrollbar py-20 px-11 border-l-2 border-l-neutral-700',
				className
			)}
		>
			<div className='text-center'>
				<Avatar
					url={currentUser.image}
					width={130}
					className='mb-6 mx-auto'
				/>
				<strong className='mb-3 block text-3xl'>{currentUser.name}</strong>
				<p className='text-neutral-500'>@{currentUser.username}</p>
			</div>

			<div className='mt-14'>
				<h2 className='font-bold text-2xl mb-6'>Top posts by you</h2>

				<Suspense fallback={<TopPostsSkeleton />}>
					<TopPosts />
				</Suspense>
			</div>
		</aside>
	)
}
