import PostDetails from '@/components/post-details'
import PostListSkeleton from '@/components/skeletons/post-list'
import { fetchPost, fetchPosts } from '@/lib/actions/post.actions'
import auth from '@/lib/auth'
import { format } from 'date-fns'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import BackButton from './back-button'
import RelatedPosts from './related-posts'

export const revalidate = 3600

export async function generateStaticParams() {
	const response = await fetchPosts()

	if (!response.success) return []

	return response.posts.map(post => ({ id: post._id }))
}

export async function generateMetadata({
	params: { id }
}: {
	params: { id: string }
}) {
	const response = await fetchPost(
		{ _id: id },
		{
			select: 'author caption likeCount commentCount createdAt',
			populate: ['author', 'username']
		}
	)

	if (!response.success) return { title: response.message }

	const { post } = response

	const slicedCaption =
		post.caption.length > 140
			? `${post.caption.slice(0, 140)}...`
			: post.caption
	const title = `${slicedCaption || 'Post details'} • Snapgram`

	const formattedDate = format(post.createdAt, 'MMMM d, yyyy')
	const description = `${post.likeCount} likes, ${post.commentCount} comments. ${post.author.username} on ${formattedDate}`

	return { title, description }
}

export default async function PostPage({
	params: { id }
}: {
	params: { id: string }
}) {
	const { user: currentUser } = await auth()
	const response = await fetchPost(
		{ _id: id },
		{ populate: ['author', 'image username name private'] }
	)

	if (!response.success) notFound()

	const isPrivateAuthor = response.post.author.private
	const isCurrentUserFollower = currentUser.following.includes(
		response.post.author._id
	)
	const isCurrentUserAuthor = currentUser._id === response.post.author._id

	if (isPrivateAuthor && !isCurrentUserFollower && !isCurrentUserAuthor)
		redirect('/')

	const { post } = response

	return (
		<>
			<div className='w-[min(68.75rem,100%-2rem)] mx-auto'>
				<BackButton className='my-5 sm:mt-20 sm:mb-10' />

				<PostDetails post={post} />

				<section
					aria-labelledby='related-posts-title'
					className='my-14 border-t border-neutral-600'
				>
					<h2
						id='related-posts-title'
						className='font-bold text-2xl my-14 sm:text-3xl'
					>
						More posts from {post.author.name}
					</h2>
					<Suspense fallback={<PostListSkeleton />}>
						<RelatedPosts
							postId={post._id}
							author={post.author}
						/>
					</Suspense>
				</section>
			</div>
		</>
	)
}
