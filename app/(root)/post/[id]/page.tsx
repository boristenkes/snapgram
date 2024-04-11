import { fetchPost, fetchPosts } from '@/lib/actions/post.actions'
import { notFound } from 'next/navigation'
import RelatedPosts from './related-posts'
import PostDetails from '@/components/post-details'
import BackButton from './back-button'

export const revalidate = 3600

export async function generateStaticParams() {
	const response = await fetchPosts()

	if (!response.success) return []

	return response.posts.map(post => ({ id: post._id }))
}

export default async function PostPage({
	params: { id }
}: {
	params: { id: string }
}) {
	const response = await fetchPost(
		{ _id: id },
		{ populate: ['author', 'image username name'] }
	)

	if (!response.success) notFound()

	const { post } = response

	return (
		<div className='w-[min(62.5rem,100%-2rem)] mx-auto'>
			<BackButton className='mt-20 mb-10' />

			<PostDetails post={post} />

			<RelatedPosts
				postId={post._id}
				author={post.author}
			/>
		</div>
	)
}
