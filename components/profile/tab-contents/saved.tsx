import ErrorMessage from '@/components/error-message'
import PostList from '@/components/post-list'
import { fetchPosts } from '@/lib/actions/post.actions'

export default async function Saved({ savedPosts }: { savedPosts: string[] }) {
	const response = await fetchPosts(
		{ _id: { $in: savedPosts } },
		{ select: 'content altText' }
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	return <PostList posts={response.posts} />
}
