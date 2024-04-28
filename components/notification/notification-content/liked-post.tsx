import { fetchPost } from '@/lib/actions/post.actions'
import { formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import { isImage } from '@/lib/utils'
import Link from 'next/link'

type LikedPostContentProps = {
	senderName: string
	createdAt: string | Date
	postId: string
}

export default async function LikedPostContent({
	senderName,
	postId,
	createdAt
}: LikedPostContentProps) {
	const response = await fetchPost({ _id: postId }, { select: 'content' })

	return (
		<div className='flex items-center justify-between w-full'>
			<div>
				<p className='font-semibold text-lg'>{senderName} liked your post</p>
				<small className='text-neutral-500'>
					{formatDistanceToNowStrict(new Date(createdAt), {
						addSuffix: true
					})}
				</small>
			</div>

			{response.success && (
				<Link href={`/post/details/${postId}`}>
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
