import { fetchPostsForUser } from '@/lib/actions/post.actions'
import { getCurrentUser } from '@/lib/session'
import ErrorMessage from '../error-message'
import Post from '@/components/post'

export default async function Feed() {
	const { user: currentUser } = await getCurrentUser()
	const response = await fetchPostsForUser(currentUser.following, {
		populateAuthor: true
	})

	if (!response.success) return <ErrorMessage message={response.message} />

	return (
		<ul className='mx-auto mb-10 space-y-10 w-[min(37.5rem,100%-2rem)]'>
			{response.posts?.map(post => (
				<li key={post._id}>
					<Post post={post} />
				</li>
			))}
		</ul>
	)
}
