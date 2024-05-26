import { Post } from '@/lib/types'
import React, { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DeletePostButton from '@/app/(root)/post/details/[id]/delete-post-button'
import auth from '@/lib/auth'
import { format } from 'date-fns'
import Tag from '@/components/tag'
import CommentInput from '@/components/post/comment-input'
import PostActionButtons from '@/components/post-action-buttons'
import Avatar from '@/components/avatar'
import PostContent from '@/components/post-content'
import CommentList from '../comment-list'
import MentionsViewer from '../mentions-viewer'
import Caption from '../post-caption'

type PostDetailsProps = {
	post: Post
}

export default async function PostDetails({ post }: PostDetailsProps) {
	const { user: currentUser } = await auth()
	const formattedDate = format(post.createdAt, "d MMMM 'at' hh:mm a")
	const isCurrentUserAuthor = currentUser._id === post.author._id

	return (
		<>
			{/* Desktop */}
			<main className='mb-12 aspect-[16/8] rounded-3xl bg-neutral-800 hidden lg:flex'>
				<div className='relative rounded-lg overflow-hidden flex-1 w-full h-full'>
					<PostContent
						content={post.content}
						alt={post.altText}
					/>
					{!!post.mentions.length && <MentionsViewer postId={post._id} />}
				</div>

				<div className='pt-9 px-7 flex-1 overflow-y-auto custom-scrollbar'>
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

						<Caption
							caption={post.caption}
							tags={post.tags}
						/>

						<CommentList postId={post._id} />

						<PostActionButtons
							currentUser={currentUser}
							post={post}
						/>

						<CommentInput
							postId={post._id}
							className='pb-9'
						/>
					</div>
				</div>
			</main>

			{/* Mobile */}
			<main className='lg:hidden w-[min(35rem,100%-2rem)] mx-auto bg-neutral-800 rounded-3xl p-4'>
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
						<div className='flex flex-none items-start gap-3'>
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

				<div className='relative'>
					<PostContent
						content={post.content}
						alt={post.altText}
						className='rounded-2xl overflow-hidden'
					/>
					{!!post.mentions.length && <MentionsViewer postId={post._id} />}
				</div>

				<PostActionButtons
					currentUser={currentUser}
					post={post}
				/>

				<CommentInput postId={post._id} />
			</main>
		</>
	)
}
