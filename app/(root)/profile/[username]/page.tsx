import Profile from '@/components/profile'
import { getAllUsers, getUserProfile } from '@/lib/actions/user.actions'
import User from '@/lib/models/user.model'
import connectMongoDB from '@/lib/mongoose'
import { getCurrentUser } from '@/lib/session'

type ProfilePageProps = {
	params: {
		username: string
	}
}

export const revalidate = 3600000 // 1h

export async function generateStaticParams() {
	const users = await getAllUsers({ select: 'username' })

	return users?.map(user => ({
		username: user.username
	}))
}

export async function generateMetadata({
	params: { username }
}: ProfilePageProps) {
	return {
		title: `Snapgram | ${username}`
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

	const user = await getUserProfile({ username })

	return (
		<Profile
			user={user}
			currentUser={currentUser}
		/>
	)
}
