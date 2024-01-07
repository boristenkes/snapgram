import Profile from '@/components/Profile'
import { getUser } from '@/lib/actions/user.actions'
import { getCurrentUser } from '@/lib/session'

type ProfilePageProps = {
	params: {
		username: string
	}
}

export default async function ProfilePage({
	params: { username }
}: ProfilePageProps) {
	const { user: currentUser } = await getCurrentUser()

	if (currentUser?.username === username)
		return (
			<Profile
				user={currentUser}
				currentUser={currentUser}
			/>
		)

	const user = await getUser({ username })

	return (
		<Profile
			user={user}
			currentUser={currentUser}
		/>
	)
}
