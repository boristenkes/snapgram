import ErrorMessage from '@/components/error-message'
import PostList from '@/components/post-list'
import { searchPosts } from '@/lib/actions/post.actions'

export default async function SearchResults({
	searchTerm
}: {
	searchTerm: string
}) {
	const response = await searchPosts(searchTerm)

	if (!response.success) return <ErrorMessage message={response.message} />

	return <PostList posts={response.posts} />
}
