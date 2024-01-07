import { getCurrentUser } from '@/lib/session'
import Story from './Story'
import { getMyStories } from '@/lib/actions/story.actions'

// const stories = [
// 	{
// 		user: {
// 			image: '/assets/users/user5.png',
// 			username: 'johnsc'
// 		},
// 		story: {
// 			seen: false,
// 			id: '1'
// 		}
// 	},
// 	{
// 		user: {
// 			image: '/assets/users/user6.png',
// 			username: 'ednamz'
// 		},
// 		story: {
// 			seen: true,
// 			id: '2'
// 		}
// 	}
// ]

export default async function StoryTrack() {
	const { user: currentUser } = await getCurrentUser()

	// const stories = await getMyStories({
	// 	following: currentUser?.following
	// })

	return (
		<div>
			{/* <ul className='flex items-center gap-6 p-16'>
				{stories.map(({ story, user }) => (
					<Story
						story={story}
						author={user}
					/>
				))}
			</ul> */}
		</div>
	)
}
