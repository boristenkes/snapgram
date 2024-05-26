import { Post as PostType } from '@/lib/types'
import Link from 'next/link'
import Avatar from '@/components/avatar'
import auth from '@/lib/auth'
import Image from 'next/image'
import CommentInput from './comment-input'
import { format } from 'date-fns'
import PostActionButtons from '@/components/post-action-buttons'
import PostContent from '../post-content'
import MentionsViewer from '../mentions-viewer'
import DeletePostButton from '@/app/(root)/post/details/[id]/delete-post-button'
import Caption from '../post-caption'

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
					<div className='flex flex-none items-center gap-3'>
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
