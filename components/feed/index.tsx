import { fetchPosts } from '@/lib/actions/post.actions'
import { getCurrentUser } from '@/lib/session'
import ErrorMessage from '../error-message'
import Post from '@/components/post'

export default async function Feed() {
	const { user: currentUser } = await getCurrentUser()
	const response = await fetchPosts(
		{
			$or: [
				{ author: { $in: currentUser.following } },
				{ author: currentUser._id }
			]
		},
		{
			populate: ['author', 'image name username'],
			sort: { createdAt: -1 }
		}
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	return (
		<ul className='mx-auto mb-10 space-y-10 sm:w-[min(37.5rem,100%)]'>
			{response.posts?.map(post => (
				<li key={post._id}>
					<Post post={post} />
				</li>
			))}
		</ul>
	)
}
