import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Posts, Tagged, Saved } from './tab-contents'
import Liked from './tab-contents/liked'
import { fetchUser } from '@/lib/actions/user.actions'
import ErrorMessage from '../error-message'
import { getCurrentUser } from '@/lib/session'
import PrivateAccountLock from './private-account-lock'

type ProfilePosts = {
	isCurrentUser: boolean
	userId: string
	username: string
}

type Tab = {
	title: string
	icon: string
}

const initialTabs: Tab[] = [
	{
		title: 'posts',
		icon: '/assets/icons/post.svg'
	},
	{
		title: 'tagged',
		icon: '/assets/icons/tag.svg'
	}
]

const authorTabs: Tab[] = [
	...initialTabs,
	{
		title: 'saved',
		icon: '/assets/icons/save-primary.svg'
	},
	{
		title: 'liked',
		icon: '/assets/icons/like.svg'
	}
]

export default async function ProfilePosts({
	isCurrentUser,
	userId
}: ProfilePosts) {
	const tabs = isCurrentUser ? authorTabs : initialTabs
	const { user: currentUser } = await getCurrentUser()
	const response = await fetchUser({ _id: userId }, { select: 'private name' })

	if (!response?.success) return <ErrorMessage message={response?.message} />

	const isPrivate = response.user.private
	const isCurrentUserFollower = currentUser.following.includes(userId)

	if (isPrivate && !isCurrentUserFollower && !isCurrentUser)
		return <PrivateAccountLock userName={response.user.name} />

	return (
		<div className='mt-16 w-full'>
			<Tabs defaultValue='posts'>
				<TabsList>
					{tabs.map(tab => (
						<TabsTrigger
							key={tab.title}
							value={tab.title}
							className='flex items-center gap-2'
						>
							<Image
								src={tab.icon}
								alt=''
								width={20}
								height={20}
							/>
							<span className='capitalize sr-only sm:not-sr-only'>
								{tab.title}
							</span>
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value='posts'>
					<Posts userId={userId} />
				</TabsContent>

				<TabsContent value='tagged'>
					<Tagged userId={userId} />
				</TabsContent>

				{isCurrentUser && (
					<>
						<TabsContent value='saved'>
							<Saved userId={userId} />
						</TabsContent>

						<TabsContent value='liked'>
							<Liked userId={userId} />
						</TabsContent>
					</>
				)}
			</Tabs>
		</div>
	)
}
