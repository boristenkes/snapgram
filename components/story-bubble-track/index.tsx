import { getCurrentUser } from '@/lib/session'
import { fetchStoriesForToday } from '@/lib/actions/story.actions'
import ErrorMessage from '../error-message'
import MyStory from './my-story'
import StoryBubble from '../story-bubble'

export default async function StoryBubbleTrack() {
	const { user: currentUser } = await getCurrentUser()
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
						author={story.author}
						storyId={story._id.toString()}
					/>
				))}
			</ul>
		</div>
	)
}
