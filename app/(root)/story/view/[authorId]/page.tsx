import { SearchParams } from '@/lib/types'
import StoryDetails from './story-details'

type Props = {
	params: {
		authorId: string
	}
	searchParams: SearchParams
}

export default function StoryPage({
	params: { authorId },
	searchParams
}: Props) {
	const index = (searchParams.index as string) ?? '0'
	const paused = !!searchParams.paused?.length

	return (
		<StoryDetails
			authorId={authorId}
			index={parseInt(index)}
			paused={paused}
		/>
	)
}
