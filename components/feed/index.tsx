import { fetchPosts } from '@/lib/actions/post.actions'
import auth from '@/lib/auth'
import ErrorMessage from '../error-message'
import Post from '@/components/post'

export default async function Feed() {
	const { user: currentUser } = await auth()
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

	if (!response.posts.length)
		return (
			<h1 className='text-center text-2xl font-semibold'>
				Follow someone to see their posts
			</h1>
		)

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
