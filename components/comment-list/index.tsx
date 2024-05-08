import { fetchComments } from '@/lib/actions/comment.actions'
import ErrorMessage from '../error-message'
import auth from '@/lib/auth'
import { cn } from '@/lib/utils'
import Comment from './comment'

export default async function CommentList({
	postId,
	className
}: {
	postId: string
	className?: string
}) {
	const { user: currentUser } = await auth()

	const response = await fetchComments(
		{ postId, isReply: false },
		{
			populate: [
				{ path: 'author', select: 'image username name' },
				{
					path: 'replies',
					select:
						'author postId likes likeCount replies content parentCommentId createdAt',
					populate: { path: 'author', select: 'image username name' },
					options: { sort: { createdAt: -1 } }
				}
			],
			sort: { createdAt: -1 }
		}
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

			{response.comments.map(comment => (
				<Comment
					key={comment._id}
					comment={comment}
					currentUser={currentUser}
				/>
			))}
		</ul>
	)
}
