'use client'

import { viewStory } from '@/lib/actions/story.actions'
import Image from 'next/image'
import { useEffect } from 'react'

type Slide = {
	_id: string
	src: string
	alt?: string
}

type Props = {
	slides: Slide[]
	index: number
	setPaused: React.Dispatch<React.SetStateAction<boolean>>
}

const Slides = ({ slides, index, setPaused }: Props) => {
	useEffect(() => {
		viewStory(slides[index]._id)
		setPaused(true)
	}, [index])

	return (
		<Image
			src={slides[index].src}
			alt={slides[index].alt ?? `Story slide #${index + 1}`}
			fill
			className='object-fit'
			sizes='(max-width: 420px) 100vw, 420px'
			onLoad={() => setPaused(false)}
		/>
	)
}

export default Slides
