import Link from 'next/link'
import Avatar from '../avatar'
import Image from 'next/image'
import { UserProfile } from '@/lib/types'
import { fetchActiveStories } from '@/lib/actions/story.actions'
import ErrorMessage from '../error-message'
import StoryBubble from '../story-bubble'

export default async function MyStory({
	currentUser
}: {
	currentUser: UserProfile
}) {
	const response = await fetchActiveStories(currentUser._id)

	if (!response.success) {
		return <ErrorMessage message={response.message} />
	}

	const { activeStories } = response

	return !!activeStories?.length ? (
		<StoryBubble
			author={currentUser}
			storyId={activeStories[0]._id.toString()}
		/>
	) : (
		<li className='relative text-center'>
			<Link href='/story/new'>
				<div className='rounded-full p-[3px] relative'>
					<Avatar
						url={currentUser?.image}
						alt={`${currentUser?.username}'s story`}
						width={62}
						height={62}
						className='p-0.5 mx-auto'
					/>
					<Image
						src='/assets/icons/add-story.svg'
						alt='Create story'
						width={16}
						height={16}
						className='absolute bottom-1 right-2'
					/>
				</div>
				Your story
			</Link>
		</li>
	)
}