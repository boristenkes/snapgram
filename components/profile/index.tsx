import { UserProfile } from '@/lib/types'
import PostList from '@/components/post-list'
import ProfileHeader from './profile-header'
import { fetchUserPosts } from '@/lib/actions/post.actions'
import ErrorMessage from '../error-message'
import { Suspense } from 'react'

type ProfileProps = {
	user: UserProfile
	currentUser: UserProfile
}

export default async function Profile({ user, currentUser }: ProfileProps) {
	const isCurrentUser = user?._id === currentUser?._id
	const response = await fetchUserPosts(user._id)

	if (!response.success) {
		return <ErrorMessage message={response.message} />
	}

	const { posts } = response

	return (
		<main className='w-[min(65.5rem,100%-2rem)] my-10 mx-auto px-4 | large:my-20 large:px-16'>
			<ProfileHeader
				user={user}
				isCurrentUser={isCurrentUser}
			/>

			{/* <Highlights /> */}

			<PostList posts={posts} />
		</main>
	)
}
