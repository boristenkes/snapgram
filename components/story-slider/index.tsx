'use client'

import useAuth from '@/hooks/use-auth'
import { Story, User } from '@/lib/types'
import { formatDistanceToNowStrict } from 'date-fns'
import { Ellipsis, Pause, Play } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../avatar'
import { Button } from '../ui/button'
import StoryBars from './bars'
import Slides from './slides'
import StoryViews from './story-views'

type Props = {
	stories: (Story & { author: User })[]
}

export default function StorySlider({ stories }: Props) {
	const { user: currentUser } = useAuth()
	const [currentIndex, setCurrentIndex] = useState(0)
	const [paused, setPaused] = useState(false)
	const author = stories[currentIndex].author

	return (
		<article className='relative mx-auto px-4 py-5 w-[min(26.25rem,100vw)] h-[min(46.25rem,100vh)] rounded-xl overflow-hidden'>
			<Slides
				slides={stories.map(story => ({
					_id: story._id,
					src: story.content,
					alt: story.alt
				}))}
				index={currentIndex}
				setPaused={setPaused}
			/>

			<div className='absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-neutral-900/80 to-transparent' />
			<div className='absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-neutral-900/80 to-transparent' />

			<div className='absolute top-5 left-4 right-4'>
				<StoryBars
					amountOfBars={stories.length}
					currentIndex={currentIndex}
					setCurrentIndex={setCurrentIndex}
					paused={paused}
				/>

				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Avatar
							url={author.image}
							alt={author.name}
							width={30}
						/>
						<span className='font-semibold'>{author.name}</span>
						<time
							dateTime={stories[currentIndex].createdAt.toString()}
							className='text-primary-200 text-sm font-semibold'
						>
							{formatDistanceToNowStrict(stories[currentIndex].createdAt, {
								addSuffix: true
							})}
						</time>
					</div>
					<div className='flex items-center gap-px'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setPaused(prev => !prev)}
						>
							{paused ? (
								<Play
									size={18}
									className='text-neutral-200'
								/>
							) : (
								<Pause
									size={18}
									className='text-neutral-200'
								/>
							)}
						</Button>

						<Button
							size='icon'
							variant='ghost'
						>
							<Ellipsis size={18} />
						</Button>
					</div>
				</div>
			</div>

			{currentUser._id === author._id && (
				<StoryViews views={stories[currentIndex].views as string[]} />
			)}
		</article>
	)
}
