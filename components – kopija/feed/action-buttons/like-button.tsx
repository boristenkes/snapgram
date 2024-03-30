import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'

type LikeButtonProps = {
	currentUserId: string
	postId: string
	likeCount: number
}

export default async function LikeButton({
	currentUserId,
	postId,
	likeCount
}: LikeButtonProps) {
	const { user: currentUser } = await getCurrentUser()
	const isLiked = currentUser.likedPosts?.includes(postId)

	return (
		<form>
			<input
				name='currentUserId'
				value={currentUserId.toString()}
				hidden
				readOnly
			/>
			<input
				name='postId'
				value={postId.toString()}
				hidden
				readOnly
			/>
			<button
				type='submit'
				className='flex items-center gap-2'
			>
				<Image
					src={
						isLiked ? '/assets/icons/like-active.svg' : '/assets/icons/like.svg'
					}
					alt={isLiked ? 'Dislike Post' : 'Like Post'}
					width={20}
					height={20}
				/>
				{likeCount}
			</button>
		</form>
	)
}
