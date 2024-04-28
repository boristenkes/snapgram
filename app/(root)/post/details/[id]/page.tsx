import { fetchPost, fetchPosts } from '@/lib/actions/post.actions'
import { notFound, redirect } from 'next/navigation'
import RelatedPosts from './related-posts'
import PostDetails from '@/components/post-details'
import BackButton from './back-button'
import { getCurrentUser } from '@/lib/session'

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
	const { user: currentUser } = await getCurrentUser()
	const response = await fetchPost(
		{ _id: id },
		{ populate: ['author', 'image username name private'] }
	)

	if (!response.success) notFound()

	const isPrivateAuthor = response.post.author.private
	const isCurrentUserFollower = currentUser.following.includes(
		response.post.author._id
	)

	if (isPrivateAuthor && !isCurrentUserFollower) redirect('/')

	const { post } = response

	return (
		<>
			<div className='w-[min(68.75rem,100%-2rem)] mx-auto'>
				<BackButton className='my-5 sm:mt-20 sm:mb-10' />

				<PostDetails post={post} />

				<RelatedPosts
					postId={post._id}
					author={post.author}
				/>
			</div>
		</>
	)
}
