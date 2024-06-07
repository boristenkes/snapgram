'use client'

import { OptimisticReply, TODO } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNowStrict } from 'date-fns'
import Link from 'next/link'
import Avatar from '../avatar'
import Loader from '../loader'
import LikeCommentButton from './like-comment-button'

type CommentRepliesProps = {
	replies: OptimisticReply[]
	expanded: boolean
	setExpanded: React.Dispatch<React.SetStateAction<boolean>>
	currentUserId: string
}

export default function CommentReplies({
	replies,
	expanded,
	setExpanded,
	currentUserId
}: CommentRepliesProps) {
	return (
		!!replies.length && (
			<div className='w-full'>
				<button
					onClick={() => setExpanded(prev => !prev)}
					className='text-xs text-neutral-500 font-semibold mt-3 flex items-center gap-3'
				>
					<div className='h-px w-4 bg-neutral-500' />
					{expanded ? 'Hide replies' : `View replies (${replies.length})`}
				</button>

				{expanded && (
					<ul className='w-full space-y-2 mt-2'>
						{replies.map((reply: TODO) => (
							<li
								key={reply._id}
								className={cn('w-full', {
									'opacity-50': reply.pending
								})}
							>
								<div className='flex items-start justify-between'>
									<div className='flex items-start gap-2 flex-1'>
										<Link href={`/profile/${reply.author.username}`}>
											<Avatar
												url={reply.author.image}
												alt={reply.author.name}
												width={30}
											/>
										</Link>
										<div>
											<p className='text-sm'>
												<Link
													href={`/profile/${reply.author.username}`}
													className='text-neutral-500 font-semibold mr-2'
												>
													{reply.author.name}
												</Link>
												{reply.content}
											</p>
											<small className='text-neutral-500'>
												{formatDistanceToNowStrict(reply.createdAt, {
													addSuffix: true
												})}
											</small>
										</div>
									</div>
									{reply.pending ? (
										<Loader />
									) : (
										<LikeCommentButton
											commentId={reply._id}
											currentUserId={currentUserId}
											isLiked={reply.likes.includes(currentUserId)}
											likeCount={reply.likeCount}
										/>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		)
	)
}
