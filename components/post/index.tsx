import { Post as PostType } from '@/lib/types'
import Link from 'next/link'
import Avatar from '@/components/avatar'
import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'
import CommentInput from './comment-input'
import { Fragment } from 'react'
import { format } from 'date-fns'
import Unavailable from '../unavailable'
import PostActionButtons from '@/components/post-action-buttons'
import PostContent from '../post-content'

export default async function Post({ post }: { post: PostType }) {
	const { user: currentUser } = await getCurrentUser()
	const isCurrentUserAuthor =
		post.author._id.toString() === currentUser._id.toString()
	const formattedDate = format(post.createdAt, "d MMMM 'at' hh:mm a")

	return (
		<article className='bg-[#09090A] w-[min(37.5rem,100%-2rem)] py-9 px-7 mx-auto rounded-2xl border-2 border-neutral-700'>
			<div className='flex justify-between items-start mb-5'>
				<Link
					href={`/profile/${post.author.username}`}
					className='flex gap-3'
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
					<Unavailable tooltip>
						<Link href={`/post/edit/${post._id}`}>
							<Image
								src='/assets/icons/edit.svg'
								alt='Edit'
								width={20}
								height={20}
							/>
						</Link>
					</Unavailable>
				)}
			</div>

			{(post.caption || post.tags.length) && (
				<pre className='font-inherit mb-8'>
					{post.caption}{' '}
					{post.tags.map(tag => (
						<Fragment key={tag}>
							<Link
								href={`#${tag}`}
								className='text-neutral-500 font-semibold'
							>
								#{tag}
							</Link>{' '}
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
		</article>
	)
}
