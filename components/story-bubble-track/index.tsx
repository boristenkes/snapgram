import { fetchStoriesForToday } from '@/lib/actions/story.actions'
import ErrorMessage from '../error-message'
import StoryBubble from '../story-bubble'
import MyStory from './my-story'

export default async function StoryBubbleTrack() {
	const response = await fetchStoriesForToday()

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
			<ul className='flex items-center gap-3 sm:gap-6 px-4 py-5 mb-4 md:p-10 lg:p-16'>
				<MyStory />

				{response.stories?.map(story => (
					<li
						key={story.author._id}
						className='relative flex-none text-center'
					>
						<StoryBubble story={story} />
					</li>
				))}
			</ul>
		</div>
	)
}
