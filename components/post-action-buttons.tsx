import {
	CommentButton,
	LikeButton,
	SaveButton,
	ShareButton
} from '@/components/post/action-buttons'
import { Post, User } from '@/lib/types'

type PostActionButtonsProps = {
	currentUser: User
	post: Post
}

export default function PostActionButtons({
	currentUser,
	post
}: PostActionButtonsProps) {
	return (
		<div className='flex items-center justify-between my-6'>
			<div className='flex items-center gap-7'>
				<LikeButton
					currentUserId={currentUser._id}
					postId={post._id}
					likeCount={post.likeCount}
					isLiked={(currentUser.likedPosts as string[]).includes(post._id)}
				/>

				<CommentButton
					postId={post._id}
					commentCount={post.commentCount}
				/>

				<ShareButton
					currentUserId={currentUser._id}
					postId={post._id}
					shareCount={post.shareCount}
				/>
			</div>

			<SaveButton
				currentUserId={currentUser._id}
				postId={post._id}
				isSaved={(currentUser.savedPosts as string[]).includes(post._id)}
			/>
		</div>
	)
}
