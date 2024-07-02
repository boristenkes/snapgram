import { StoryForToday } from '@/lib/actions/story.actions'
import auth from '@/lib/auth'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Avatar from './avatar'
import ErrorMessage from './error-message'

type StoryBubbleProps = {
	story: StoryForToday
}

export default async function StoryBubble({ story }: StoryBubbleProps) {
	const { user: currentUser } = await auth()

	if (!currentUser)
		return <ErrorMessage message='You must log in to view this story' />

	return (
		<Link
			href={`/story/view/${story.author._id}`}
			scroll={false}
		>
			<div
				className={cn(
					'rounded-full p-[3px] w-fit mx-auto',
					story.seen
						? 'bg-gradient-to-b from-slate-500 to-slate-600'
						: 'bg-gradient-story'
				)}
			>
				<Avatar
					url={story.author.image}
					alt={`${story.author.username}'s story`}
					width={64}
					height={64}
					className='p-0.5 mx-auto size-14 sm:size-16'
				/>
			</div>
			<span className='text-sm block max-w-20 truncate'>
				{story.author.username}
			</span>
		</Link>
	)
}
