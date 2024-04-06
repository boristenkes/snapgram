import ErrorMessage from '@/components/error-message'
import PostList from '@/components/post-list'
import { fetchUser } from '@/lib/actions/user.actions'

export default async function Liked({ userId }: { userId: string }) {
	const response = await fetchUser({ _id: userId }, 'likedPosts', 'likedPosts')

	if (!response.success) return <ErrorMessage message={response.message} />

	return <PostList posts={response.user.likedPosts} />
}
