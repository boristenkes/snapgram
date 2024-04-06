import ErrorMessage from '@/components/error-message'
import PostList from '@/components/post-list'
import { fetchUser } from '@/lib/actions/user.actions'
import { Post } from '@/lib/types'

export default async function Saved({ userId }: { userId: string }) {
	const response = await fetchUser({ _id: userId }, 'savedPosts', 'savedPosts')

	if (!response.success) return <ErrorMessage message={response.message} />

	return <PostList posts={response.user.savedPosts as Post[]} />
}
