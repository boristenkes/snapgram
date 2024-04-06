import { getCurrentUser } from '@/lib/session'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import ErrorMessage from './error-message'
import Avatar from './avatar'
import { User } from '@/lib/types'

type StoryBubbleProps = {
	storyId: string
	author: User
}

export default async function StoryBubble({
	storyId,
	author
}: StoryBubbleProps) {
	const { user: currentUser } = await getCurrentUser()

	if (!currentUser)
		return <ErrorMessage message='You must log in to view this story' />

	const isSeen = currentUser.seenStories?.includes(storyId)

	return (
		<li className='relative flex-none text-center'>
			<Link href={`/stories/${author._id}`}>
				<div
					className={cn('rounded-full p-[3px] w-fit mx-auto', {
						'story-unseen': !isSeen,
						'story-seen': isSeen
					})}
				>
					<Avatar
						url={author.image}
						alt={`${author.username}'s story`}
						width={62}
						height={62}
						className='p-0.5 mx-auto'
					/>
				</div>
				{author.username}
			</Link>
		</li>
	)
}
