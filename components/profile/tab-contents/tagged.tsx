import ErrorMessage from '@/components/error-message'
import PostList from '@/components/post-list'
import { fetchPosts } from '@/lib/actions/post.actions'

export default async function Tagged({ userId }: { userId: string }) {
	const response = await fetchPosts({ mentions: userId })

	if (!response.success) return <ErrorMessage message={response.message} />

	return <PostList posts={response.posts} />
}
