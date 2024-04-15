'use client'

import toast from '@/lib/toast'
import Image from 'next/image'
import { toggleCommentLike } from '@/lib/actions/comment.actions'
import { useCallback, useOptimistic, useState } from 'react'

type LikeButtonProps = {
	currentUserId: string
	commentId: string
	likeCount: number
	isLiked: boolean
}

export default function LikeButton({
	currentUserId,
	commentId,
	likeCount,
	isLiked
}: LikeButtonProps) {
	const [likes, setLikes] = useState({
		liked: isLiked,
		total: likeCount
	})
	const [optimisticLikes, setOptimisticLikes] = useOptimistic(likes)

	const toggleLike = useCallback(async () => {
		setOptimisticLikes(prev => ({
			liked: !prev.liked,
			total: prev.liked ? prev.total - 1 : prev.total + 1
		}))

		const response = await toggleCommentLike({ currentUserId, commentId })

		if (!response.success) {
			setLikes(likes)
			toast(response.message, { type: 'error' })
			return
		}

		setLikes(prev => ({
			liked: !prev.liked,
			total: prev.liked ? prev.total - 1 : prev.total + 1
		}))
	}, [likes, setLikes, optimisticLikes, setOptimisticLikes, toggleCommentLike])

	return (
		<form action={toggleLike}>
			<button
				type='submit'
				className='flex items-center gap-2 text-neutral-300'
				aria-label={optimisticLikes.liked ? 'Dislike post' : 'Like post'}
			>
				<Image
					src={
						optimisticLikes.liked
							? '/assets/icons/like-active.svg'
							: '/assets/icons/like.svg'
					}
					alt=''
					width={20}
					height={20}
					className='w-5 h-5'
				/>
				{optimisticLikes.total}
			</button>
		</form>
	)
}
