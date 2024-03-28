import ErrorMessage from '@/components/error-message'
import Profile from '@/components/profile'
import { fetchAllUsers, getUserProfile } from '@/lib/actions/user.actions'
import { getCurrentUser } from '@/lib/session'

type ProfilePageProps = {
	params: {
		username: string
	}
}

export const revalidate = 3600 // 1h

export async function generateStaticParams() {
	const users = await fetchAllUsers({ select: 'username' })

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

	const response = await getUserProfile({ username })

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
