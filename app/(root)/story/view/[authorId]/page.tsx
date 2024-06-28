import StoryDetails from './story-details'

type Props = {
	params: {
		authorId: string
	}
}

export default function StoryPage({ params: { authorId } }: Props) {
	return <StoryDetails authorId={authorId} />
}
