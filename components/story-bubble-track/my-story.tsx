import Link from 'next/link'
import Avatar from '../avatar'
import Image from 'next/image'
import { User } from '@/lib/types'
import { fetchStories } from '@/lib/actions/story.actions'
import ErrorMessage from '../error-message'
import StoryBubble from '../story-bubble'

export default async function MyStory({ currentUser }: { currentUser: User }) {
	const response = await fetchStories({
		author: currentUser._id,
		createdAt: {
			$gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) // is posted within last 24h
		}
	})

	if (!response.success) {
		return <ErrorMessage message={response.message} />
	}

	const { stories: activeStories } = response

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
