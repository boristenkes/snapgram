'use client'

import { formatDistanceToNowStrict } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import Avatar from '@/components/avatar'
import { Input } from '@/components/ui/input'
import toast from '@/lib/toast'
import { replyToComment } from '@/lib/actions/comment.actions'
import { Comment as CommentType, OptimisticReply, User } from '@/lib/types'
import { ElementRef, useOptimistic, useRef, useState } from 'react'
import LikeCommentButton from './like-comment-button'
import CommentReplies from './comment-replies'

type CommentProps = {
	comment: CommentType
	currentUser: User
}

export default function Comment({ comment, currentUser }: CommentProps) {
	const [replyMode, setReplyMode] = useState(false)
	const [replies, setReplies] = useState<CommentType[]>(
		comment.replies as CommentType[]
	)
	const [optimisticReplies, setOptimisticReplies] =
		useOptimistic<OptimisticReply[]>(replies)
	const [repliesExpanded, setRepliesExpanded] = useState(false)
	const inputRef = useRef<ElementRef<'input'>>(null)
	const author = comment.author as User

	const toggleReplyMode = () => setReplyMode(prev => !prev)

	const reply = async () => {
		if (!inputRef.current) return

		const replyContent = inputRef.current.value

		if (!replyContent.length) {
			setReplyMode(false)
			return
		}

		const newOptimisticReply: OptimisticReply = {
			postId: comment.postId,
			parentCommentId: comment._id,
			author: currentUser,
			content: replyContent,
			likes: [],
			likeCount: 0,
			createdAt: new Date(),
			pending: true
		}

		if (inputRef.current) {
			inputRef.current.value = ''
			inputRef.current.disabled = true
		}

		setOptimisticReplies(prev => [newOptimisticReply, ...prev])

		const response = await replyToComment({
			postId: comment.postId,
			parentCommentId: comment._id,
			content: replyContent,
			author: currentUser._id
		})

		if (!response.success) {
			setReplies(replies)
			toast(response.message, { type: 'error' })
			return
		}

		setReplies(prev => [response.comment, ...prev])

		inputRef.current.disabled = false
	}

	return (
		<li
			key={comment._id}
			className='flex gap-2'
		>
			<div className='flex items-start gap-2 flex-1'>
				<Avatar
					url={author.image}
					alt={author.name}
					width={36}
					height={36}
				/>

				<div className='w-full'>
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

						<button
							onClick={toggleReplyMode}
							className='text-xs flex items-center gap-1 text-neutral-200'
						>
							<Image
								src='/assets/icons/reply.svg'
								alt=''
								width={12}
								height={10}
							/>
							Reply
						</button>
					</div>

					{replyMode && (
						<form
							action={reply}
							className='relative'
						>
							<label
								htmlFor='reply-content'
								className='sr-only'
							>
								Write your reply
							</label>
							<Input
								id='reply-content'
								ref={inputRef}
								placeholder='Write your reply...'
								className='text-xs py-0.5 pl-2 pr-8'
								autoFocus
							/>
							<button
								type='submit'
								className='absolute top-1/2 -translate-y-1/2 right-2'
								aria-label='Reply'
							>
								<Image
									src='/assets/icons/send.svg'
									alt=''
									width={18}
									height={17}
								/>
							</button>
						</form>
					)}

					<CommentReplies
						replies={optimisticReplies}
						currentUserId={currentUser._id}
						expanded={repliesExpanded}
						setExpanded={setRepliesExpanded}
					/>
				</div>
			</div>

			<div className='mr-2'>
				<LikeCommentButton
					currentUserId={currentUser._id}
					commentId={comment._id}
					isLiked={comment.likes.includes(currentUser._id)}
					likeCount={comment.likeCount}
				/>
			</div>
		</li>
	)
}
