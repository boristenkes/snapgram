import { doesCurrentUserHaveActiveStories } from '@/lib/actions/story.actions'
import auth from '@/lib/auth'
import { SquarePlus } from 'lucide-react'
import Link from 'next/link'
import Avatar from '../avatar'
import ErrorMessage from '../error-message'
import StoryBubble from '../story-bubble'

export default async function MyStory() {
	const { user: currentUser } = await auth()
	const response = await doesCurrentUserHaveActiveStories()

	if (!response.success) {
		return <ErrorMessage message={response.message} />
	}

	if (response.hasActiveStories) {
		return (
			<li className='relative flex-none text-center'>
				<StoryBubble
					story={{
						author: currentUser,
						seen: response.hasUnseenStories
					}}
				/>
			</li>
		)
	}

	return (
		<li className='relative text-center'>
			<Link
				href='/story/new'
				className='text-sm'
			>
				<div className='rounded-full p-[3px] relative'>
					<Avatar
						url={currentUser?.image}
						alt={`${currentUser?.username}'s story`}
						width={62}
						height={62}
						className='p-0.5 mx-auto'
					/>
					<SquarePlus
						size={16}
						className='absolute bottom-1 right-2 text-primary-500'
					/>
				</div>
				Your story
			</Link>
		</li>
	)
}
