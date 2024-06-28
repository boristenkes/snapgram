import ErrorMessage from '@/components/error-message'
import StorySlider from '@/components/story-slider'
import { fetchStories } from '@/lib/actions/story.actions'
import { Story, User } from '@/lib/types'
import { redirect } from 'next/navigation'

type Props = {
	authorId: string
}

export default async function StoryDetails({ authorId }: Props) {
	const response = await fetchStories(
		{ author: authorId },
		{
			populate: ['author', 'image name username']
		}
	)

	if (!response.success) {
		return <ErrorMessage message={response.message} />
	}

	const stories = response.stories as (Story & { author: User })[]

	if (!stories.length) redirect('/')

	return <StorySlider stories={stories} />
}
