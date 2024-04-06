import Avatar from '@/components/avatar'
import ErrorMessage from '@/components/error-message'
import PostCard from '@/components/post-card'
import { fetchTopPostsByUser } from '@/lib/actions/post.actions'
import { getCurrentUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export default async function TopPosts({
	className = ''
}: {
	className?: string
}) {
	const { user: currentUser } = await getCurrentUser()
	const response = await fetchTopPostsByUser(currentUser._id)

	return (
		<aside
			className={cn(
				'sticky top-0 right-0 max-h-screen h-full overflow-y-auto custom-scrollbar py-20 px-11 border-l-2 border-l-neutral-700',
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

				{!response.success ? (
					<ErrorMessage message={response.message} />
				) : (
					<ul className='space-y-6'>
						{response.posts.map(post => (
							<li key={post._id.toString()}>
								<PostCard post={post} />
							</li>
						))}
					</ul>
				)}
			</div>
		</aside>
	)
}
