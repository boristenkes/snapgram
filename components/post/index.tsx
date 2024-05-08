import { Post as PostType } from '@/lib/types'
import Link from 'next/link'
import Avatar from '@/components/avatar'
import auth from '@/lib/auth'
import Image from 'next/image'
import CommentInput from './comment-input'
import { Fragment } from 'react'
import { format } from 'date-fns'
import PostActionButtons from '@/components/post-action-buttons'
import PostContent from '../post-content'
import Tag from '@/components/tag'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import MentionsViewer from '../mentions-viewer'

export default async function Post({ post }: { post: PostType }) {
	const { user: currentUser } = await auth()
	const isCurrentUserAuthor =
		post.author._id.toString() === currentUser._id.toString()
	const formattedDate = format(post.createdAt, "d MMMM 'at' hh:mm a")

	return (
		<article className='bg-[#09090A] w-[min(37.5rem,100%-2rem)] py-5 px-4 sm:py-9 sm:px-7 mx-auto rounded-2xl border-2 border-neutral-700'>
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
					<Button
						asChild
						size='icon'
						variant='ghost'
					>
						<Link href={`/post/edit/${post._id}`}>
							<Image
								src='/assets/icons/edit.svg'
								alt='Edit'
								width={20}
								height={20}
							/>
						</Link>
					</Button>
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
		</article>
	)
}
