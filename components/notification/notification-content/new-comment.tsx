import { fetchPost } from '@/lib/actions/post.actions'
import { isImage } from '@/lib/utils'
import { formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

type NewCommentContentProps = {
	senderName: string
	createdAt: string | Date
	commentContent: string
	postId: string
}

export default async function NewCommentContent({
	senderName,
	createdAt,
	commentContent,
	postId
}: NewCommentContentProps) {
	const response = await fetchPost({ _id: postId }, { select: 'content' })

	return (
		<div className='flex items-center justify-between gap-1 w-full'>
			<div>
				<p className='font-semibold text-sm sm:text-lg'>
					{senderName} commented on your post{' '}
					<q>
						{commentContent.slice(0, 50)}
						{commentContent.length > 50 && '...'}
					</q>
				</p>
				<small className='text-neutral-500'>
					{formatDistanceToNowStrict(new Date(createdAt), {
						addSuffix: true
					})}
				</small>
			</div>

			{response.success && (
				<Link
					href={`/post/details/${postId}`}
					className='flex-none'
				>
					{isImage(response.post.content[0]) ? (
						<Image
							src={response.post.content[0]}
							alt='View post'
							width={64}
							height={64}
							className='w-16 aspect-square rounded-lg object-cover'
						/>
					) : (
						<video
							src={response.post.content[0]}
							width={64}
							height={64}
							className='w-16 aspect-square rounded-lg object-cover'
						/>
					)}
				</Link>
			)}
		</div>
	)
}
