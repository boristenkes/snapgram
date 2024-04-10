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

	return (
		<section
			aria-labelledby='related-posts-title'
			className='my-14 border-t border-neutral-600'
		>
			<h2
				id='related-posts-title'
				className='font-bold text-2xl my-14 sm:text-3xl'
			>
				More posts from {author.name}
			</h2>

			{response.success ? (
				<PostList posts={response.posts} />
			) : (
				<ErrorMessage message={response.message} />
			)}
		</section>
	)
}
