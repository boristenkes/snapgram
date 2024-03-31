import { Post as PostType } from '@/lib/types'
import Link from 'next/link'
import Avatar from '../avatar'
import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'
import { LikeButton, ShareButton, SaveButton } from './action-buttons'
import CommentInput from './comment-input'
import { Fragment } from 'react'
import { format } from 'date-fns'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel'

export default async function FeedPost({ post }: { post: PostType }) {
	const { user: currentUser } = await getCurrentUser()
	const isCurrentUserAuthor =
		post.author._id.toString() === currentUser._id.toString()
	const formattedDate = format(post.createdAt, "d MMMM 'at' hh:mm a")

	return (
		<article className='bg-[#09090A] w-[min(37.5rem,100%-2rem)] py-9 px-7 rounded-3xl border-2 border-neutral-700'>
			<div className='flex justify-between mb-5'>
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
					<Link href={`/post/edit/${post._id}`}>
						<Image
							src='/assets/icons/edit.svg'
							alt='Edit'
							width={20}
							height={20}
						/>
					</Link>
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

			<div className='rounded-3xl overflow-hidden'>
				<Carousel className='max-h-[32.5rem]'>
					<CarouselContent>
						{post.content.map(contentUrl => (
							<CarouselItem key={contentUrl}>
								<Image
									src={contentUrl}
									alt={post.altText}
									width={542}
									height={520}
									className='aspect-square object-cover'
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className='left-4 bg-neutral-700 border-neutral-700' />
					<CarouselNext className='right-4 bg-neutral-700 border-neutral-700' />
				</Carousel>
			</div>

			<div className='flex items-center justify-between mt-8 mb-10'>
				<div className='flex items-center gap-7'>
					<LikeButton
						currentUserId={currentUser._id}
						postId={post._id.toString()}
						likeCount={post.likeCount}
					/>

					<Link
						href={`/post/${post._id}`}
						className='flex items-center gap-2'
					>
						<Image
							src='/assets/icons/comment.svg'
							alt='Comments'
							width={20}
							height={20}
						/>
						{post.commentCount}
					</Link>

					<ShareButton
						currentUserId={currentUser._id}
						postId={post._id.toString()}
						shareCount={post.shareCount}
					/>
				</div>

				<SaveButton postId={post._id.toString()} />
			</div>

			<CommentInput />
		</article>
	)
}
