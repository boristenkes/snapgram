import Profile from '@/components/profile'
import { getAllUsers, getUser } from '@/lib/actions/user.actions'
import { getCurrentUser } from '@/lib/session'

type ProfilePageProps = {
	params: {
		username: string
	}
}

export const revalidate = 3600000 // 1h

export async function generateStaticParams() {
	const users = await getAllUsers({ select: 'username' })
	const usernames = await users?.map(user => user.username)

	return usernames?.map(username => ({ username }))
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
