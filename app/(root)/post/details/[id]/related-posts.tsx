import ErrorMessage from '@/components/error-message'
import PostList from '@/components/post-list'
import { fetchPosts } from '@/lib/actions/post.actions'
import { User } from '@/lib/types'

type MostRealtedPostsProps = {
	postId: string
	author: User
}

export default async function RelatedPosts({
	postId,
	author
}: MostRealtedPostsProps) {
	const response = await fetchPosts({
		_id: { $ne: postId },
		author: author._id
	})

	if (!response.success) return <ErrorMessage message={response.message} />

	return <PostList posts={response.posts} />
}
