import { User } from '@/lib/types'
import ProfileHeader from './profile-header'
import ProfilePosts from './profile-posts'

type ProfileProps = {
	user: User
	currentUser: User
}

export default async function Profile({ user, currentUser }: ProfileProps) {
	const isCurrentUser = user?._id === currentUser?._id

	return (
		<main className='w-[min(65.5rem,100%-2rem)] my-10 mx-auto px-4 | large:my-20 large:px-16'>
			<ProfileHeader
				user={user}
				isCurrentUser={isCurrentUser}
			/>

			{/* <Highlights /> */}

			<ProfilePosts
				isCurrentUser={isCurrentUser}
				userId={user._id}
				username={user.username!}
			/>
		</main>
	)
}
