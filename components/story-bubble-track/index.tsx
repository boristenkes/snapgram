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
		<ul className='overflow-x-auto custom-scrollbar flex items-center gap-3 sm:gap-6 px-4 py-5 mb-4 md:p-10 lg:p-16'>
			<MyStory />

			{/* {Array.from({ length: 20 }, (_, idx) => idx).map(idx => (
				<li
					key={idx}
					className='relative flex-none text-center'
				>
					<StoryBubble story={response.stories[0]} />
				</li>
			))} */}

			{response.stories?.map(story => (
				<li
					key={story.author._id}
					className='relative flex-none text-center'
				>
					<StoryBubble story={story} />
				</li>
			))}
		</ul>
	)
}
