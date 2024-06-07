import { fetchStoriesForToday } from '@/lib/actions/story.actions'
import auth from '@/lib/auth'
import { User } from '@/lib/types'
import ErrorMessage from '../error-message'
import StoryBubble from '../story-bubble'
import MyStory from './my-story'

export default async function StoryBubbleTrack() {
	const { user: currentUser } = await auth()
	const response = await fetchStoriesForToday(currentUser._id)

	if (!response.success) {
		return (
			<ErrorMessage
				message={response.message}
				className='mx-8'
			/>
		)
	}

	return (
		<div>
			<ul className='flex items-center gap-6 px-4 py-5 mb-4 md:p-10 lg:p-16'>
				<MyStory currentUser={currentUser} />

				{response.stories?.map(story => (
					<StoryBubble
						key={story._id}
						author={story.author as User}
						storyId={story._id.toString()}
					/>
				))}
			</ul>
		</div>
	)
}
