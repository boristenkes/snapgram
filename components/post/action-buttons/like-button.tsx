'use client'

import { togglePostLike } from '@/lib/actions/post.actions'
import toast from '@/lib/toast'
import Image from 'next/image'
import { useCallback, useOptimistic, useState } from 'react'

type LikeButtonProps = {
	currentUserId: string
	postId: string
	likeCount: number
	isLiked: boolean
}

export default function LikeButton({
	currentUserId,
	postId,
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

		const response = await togglePostLike({ currentUserId, postId })

		if (!response.success) {
			setLikes(likes)
			toast(response.message, { type: 'error' })
			return
		}

		setLikes(prev => ({
			liked: !prev.liked,
			total: prev.liked ? prev.total - 1 : prev.total + 1
		}))
	}, [likes, setLikes, optimisticLikes, setOptimisticLikes, togglePostLike])

	return (
		<form action={toggleLike}>
			<button
				type='submit'
				className='flex items-center gap-2'
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
