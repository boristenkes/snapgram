import { cn } from '@/lib/utils'
import Link from 'next/link'
import ProfilePicture from './ProfilePicture'

type StoryProps = {
	story: {
		seen: boolean
		id: string
	}
	author: {
		image: string
		username: string
	}
}

export default function Story({ story, author }: StoryProps) {
	return (
		<li
			key={story.id}
			className='relative text-center'
		>
			<Link href={`/story/${story.id}`}>
				<div
					className={cn('rounded-full p-[3px]', {
						'story-unseen': !story.seen,
						'story-seen': story.seen
					})}
				>
					<ProfilePicture
						url={author.image}
						alt={`${author.username}'s story`}
						width={62}
						height={62}
						className='p-0.5'
					/>
				</div>
				{author.username}
			</Link>
		</li>
	)
}
