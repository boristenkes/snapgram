import Avatar from '@/components/avatar'
import { fetchPost, fetchPosts } from '@/lib/actions/post.actions'
import { getCurrentUser } from '@/lib/session'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DeletePostButton from './delete-post-button'
import { Fragment } from 'react'
import CommentInput from '@/components/post/comment-input'
import RelatedPosts from './related-posts'
import PostActionButtons from '@/components/post-action-buttons'
import PostContent from '@/components/post-content'
import Tag from '@/components/tag'

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
		{ populate: ['author', 'image username name'] }
	)

	if (!response.success) notFound()

	const { post } = response
	const formattedDate = format(post.createdAt, "d MMMM 'at' hh:mm a")
	const isCurrentUserAuthor = currentUser._id === post.author._id

	return (
		<div className='w-[min(62.5rem,100%-2rem)] mx-auto'>
			{/* Desktop */}
			<main className='mt-20 mb-12 rounded-3xl bg-neutral-800 hidden sm:flex'>
				<div className='rounded-lg overflow-hidden flex-1'>
					<PostContent
						content={post.content}
						alt={post.altText}
					/>
				</div>

				<div className='py-9 px-7 flex-1'>
					<div className='h-full flex flex-col'>
						<div className='flex justify-between mb-5'>
							<Link
								href={`/profile/${post.author.username}`}
								className='flex gap-3'
							>
								<Avatar
									url={post.author.image}
									alt={post.author.name}
									width={50}
								/>
								<div>
									<strong>{post.author.name}</strong>
									<p className='text-neutral-500'>{formattedDate}</p>
								</div>
							</Link>

							{isCurrentUserAuthor && (
								<div className='flex items-start gap-3'>
									<Link href={`/post/edit/${post._id}`}>
										<Image
											src='/assets/icons/edit.svg'
											alt='Edit'
											width={20}
											height={20}
										/>
									</Link>
									<DeletePostButton
										currentUserId={currentUser._id}
										targetPostId={post._id}
									/>
								</div>
							)}
						</div>

						{(post.caption || !!post.tags.length) && (
							<pre className='font-inherit mb-8 pb-6 border-b border-neutral-600 text-wrap'>
								{post.caption}{' '}
								{post.tags.map(tag => (
									<Fragment key={tag}>
										<Link
											href={`/explore?search=${tag}`}
											className='text-neutral-500 font-semibold'
										>
											#{tag}
										</Link>{' '}
									</Fragment>
								))}
							</pre>
						)}

						<div className='flex-1'>{/* <Comments /> */}</div>

						<PostActionButtons
							currentUser={currentUser}
							post={post}
						/>

						<CommentInput />
					</div>
				</div>
			</main>

			{/* Mobile */}
			<main className='sm:hidden'>
				<div className='flex justify-between items-center'>
					<Link
						href={`/profile/${post.author.username}`}
						className='flex gap-3 mt-6 mb-4'
					>
						<Avatar
							url={post.author.image}
							alt={post.author.name}
							width={50}
							height={50}
						/>
						<div>
							<strong>{post.author.name}</strong>
							<p className='text-neutral-500'>{formattedDate}</p>
						</div>
					</Link>

					{isCurrentUserAuthor && (
						<div className='flex items-start gap-3'>
							<Link href={`/post/edit/${post._id}`}>
								<Image
									src='/assets/icons/edit.svg'
									alt='Edit'
									width={20}
									height={20}
								/>
							</Link>
							<DeletePostButton
								currentUserId={currentUser._id}
								targetPostId={post._id}
							/>
						</div>
					)}
				</div>

				{(post.caption || !!post.tags.length) && (
					<pre className='font-inherit mb-8 text-wrap'>
						{post.caption}{' '}
						{post.tags.map(tag => (
							<Fragment key={tag}>
								<Tag tag={tag} />{' '}
							</Fragment>
						))}
					</pre>
				)}

				<PostContent
					content={post.content}
					alt={post.altText}
					className='rounded-2xl overflow-hidden'
				/>

				<PostActionButtons
					currentUser={currentUser}
					post={post}
				/>

				<CommentInput />
			</main>

			<RelatedPosts
				postId={post._id}
				author={post.author}
			/>
		</div>
	)
}
