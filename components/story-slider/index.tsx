import auth from '@/lib/auth'
import { Story, User } from '@/lib/types'
import { formatDistanceToNowStrict } from 'date-fns'
import { Pause, Play } from 'lucide-react'
import Link from 'next/link'
import Avatar from '../avatar'
import { Button } from '../ui/button'
import StoryBars from './bars'
import Slides from './slides'
import StoryOptionsButton from './story-options-button'
import StoryViews from './story-views'

type Props = {
	stories: (Story & { author: User })[]
	index: number
	paused: boolean
}

export default async function StorySlider({ stories, index, paused }: Props) {
	const { user: currentUser } = await auth()
	const author = stories[index].author

	return (
		<article className='relative mx-auto px-4 py-5 w-[min(26.25rem,100vw)] h-[min(46.25rem,100vh)] rounded-xl overflow-hidden'>
			<Slides
				slides={stories.map(story => ({
					_id: story._id,
					src: story.content,
					alt: story.alt
				}))}
				index={index}
				paused={paused}
			/>

			<div className='absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-neutral-900/80 to-transparent' />
			<div className='absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-neutral-900/80 to-transparent' />

			<div className='absolute top-5 left-4 right-4'>
				<StoryBars
					amountOfBars={stories.length}
					index={index}
					paused={paused}
					authorId={author._id}
				/>

				<div className='flex items-center justify-between'>
					<Link
						href={`/profile/${author.username}`}
						className='flex items-center gap-2'
					>
						<Avatar
							url={author.image}
							alt={author.name}
							width={30}
						/>

						<span className='font-semibold'>{author.name}</span>

						<time
							dateTime={stories[index].createdAt.toString()}
							className='text-primary-200 text-sm font-semibold'
						>
							{formatDistanceToNowStrict(stories[index].createdAt, {
								addSuffix: true
							})}
						</time>
					</Link>

					<div className='flex items-center gap-px'>
						<Button
							asChild
							size='icon'
							variant='ghost'
							className='text-neutral-200'
						>
							<Link
								href={{
									query: { paused: paused ? '' : true }
								}}
								replace
								scroll={false}
							>
								{paused ? <Play size={18} /> : <Pause size={18} />}
							</Link>
						</Button>

						<StoryOptionsButton
							storyId={stories[index]._id}
							authorId={author._id}
						/>
					</div>
				</div>
			</div>

			{currentUser._id === author._id && (
				<StoryViews views={stories[index].views as string[]} />
			)}
		</article>
	)
}
