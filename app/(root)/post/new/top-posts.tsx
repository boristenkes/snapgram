import ErrorMessage from '@/components/error-message'
import PostCard from '@/components/post-card'
import { fetchTopPostsByUser } from '@/lib/actions/post.actions'
import auth from '@/lib/auth'

export default async function TopPosts() {
	const { user: currentUser } = await auth()
	const response = await fetchTopPostsByUser(currentUser._id)

	if (!response.success) return <ErrorMessage message={response.message} />

	return (
		<ul className='space-y-6'>
			{response.posts.map(post => (
				<li key={post._id.toString()}>
					<PostCard post={post} />
				</li>
			))}
		</ul>
	)
}
