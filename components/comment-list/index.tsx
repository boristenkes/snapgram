import { fetchComments } from '@/lib/actions/comment.actions'
import ErrorMessage from '../error-message'
import Avatar from '../avatar'
import Link from 'next/link'
import { User } from '@/lib/types'
import LikeCommentButton from './like-comment-button'
import { getCurrentUser } from '@/lib/session'
import { formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default async function CommentList({
	postId,
	className
}: {
	postId: string
	className?: string
}) {
	const { user: currentUser } = await getCurrentUser()

	const response = await fetchComments(
		{ postId },
		{ populate: ['author', 'image username name'], sort: { createdAt: -1 } }
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	return (
		<ul
			className={cn(
				'flex flex-col flex-grow h-1 gap-6 overflow-y-auto custom-scrollbar',
				className
			)}
		>
			{!response.comments.length && (
				<li className='text-neutral-500'>
					This post doesn't have any comments
				</li>
			)}

			{response.comments.map(comment => {
				const author = comment.author as User

				return (
					<li
						key={comment._id}
						className='flex items-start gap-2'
					>
						<Avatar
							url={author.image}
							alt={author.name}
							width={36}
							height={36}
						/>

						<div className='flex-1'>
							<p className='text-sm'>
								<Link
									href={`/profile/${author.username}`}
									className='text-neutral-500 font-semibold mr-2'
								>
									{author.name}
								</Link>
								{comment.content}
							</p>

							<div className='flex items-center gap-2.5 mt-1'>
								<small className='text-neutral-500'>
									{formatDistanceToNowStrict(comment.createdAt, {
										addSuffix: true
									})}
								</small>

								<button className='text-xs flex items-center gap-1 text-neutral-200'>
									<Image
										src='/assets/icons/reply.svg'
										alt=''
										width={14}
										height={14}
									/>
									Reply
								</button>
							</div>
						</div>

						<LikeCommentButton
							currentUserId={currentUser._id}
							commentId={comment._id}
							isLiked={comment.likes.includes(currentUser._id)}
							likeCount={comment.likeCount}
						/>
					</li>
				)
			})}
		</ul>
	)
}
