import { viewStory } from '@/lib/actions/story.actions'
import Image from 'next/image'

type Slide = {
	_id: string
	src: string
	alt?: string
}

type Props = {
	slides: Slide[]
	index: number
	paused: boolean
}

const Slides = ({ slides, index, paused }: Props) => {
	viewStory(slides[index]._id)

	return (
		<Image
			src={slides[index].src}
			alt={slides[index].alt ?? `Story slide #${index + 1}`}
			fill
			className='object-fit'
			sizes='(max-width: 420px) 100vw, 420px'
			priority
		/>
	)
}

export default Slides
