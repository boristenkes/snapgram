import ErrorMessage from '@/components/error-message'
import Profile from '@/components/profile'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { getCurrentUser } from '@/lib/session'

type ProfilePageProps = {
	params: {
		username: string
	}
}

export const revalidate = 3600 // 1h

export async function generateStaticParams() {
	const response = await fetchUsers({ username: { $exists: true } }, 'username')

	if (!response.success) return []

	return response.users.map(user => ({
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

	const response = await fetchUser(
		{ username },
		'image name username postsCount followersCount followingCount bio posts private verified'
	)

	if (!response.success) {
		return <ErrorMessage message={response.message} />
	}

	return (
		<Profile
			user={response.user}
			currentUser={currentUser}
		/>
	)
}
