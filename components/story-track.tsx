import { getCurrentUser } from '@/lib/session'
import Story from './story'
import { getMyStories } from '@/lib/actions/story.actions'
import ProfilePicture from './profile-picture'
import Link from 'next/link'
import Image from 'next/image'

const stories = [
	{
		user: {
			image: '/assets/users/user5.png',
			username: 'johnsc'
		},
		story: {
			seen: false,
			id: '1'
		}
	},
	{
		user: {
			image: '/assets/users/user6.png',
			username: 'ednamz'
		},
		story: {
			seen: true,
			id: '2'
		}
	}
]

export default async function StoryTrack() {
	const { user: currentUser } = await getCurrentUser()

	// const stories = await getMyStories({
	// 	following: currentUser?.following
	// })

	return (
		<div>
			<ul className='flex items-center gap-6 p-16'>
				<li className='relative text-center'>
					<Link href='/story/new'>
						<div className='rounded-full p-[3px] relative'>
							<ProfilePicture
								url={currentUser?.image}
								alt={`${currentUser?.username}'s story`}
								width={62}
								height={62}
								className='p-0.5 mx-auto'
							/>
							<Image
								src='/assets/icons/add-story.svg'
								alt='Create story'
								width={16}
								height={16}
								className='absolute bottom-1 right-2'
							/>
						</div>
						{currentUser?.username}
					</Link>
				</li>

				{stories.map(({ story, user }) => (
					<Story
						key={story.id}
						story={story}
						author={user}
					/>
				))}
			</ul>
		</div>
	)
}
