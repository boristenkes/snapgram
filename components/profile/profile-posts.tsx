import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Posts, Tagged, Saved } from './tab-contents'
import Liked from './tab-contents/liked'

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

	return (
		<div className='mt-16'>
			<Tabs defaultValue='posts'>
				<TabsList>
					{tabs.map(tab => (
						<TabsTrigger
							key={tab.title}
							value={tab.title}
						>
							<Image
								src={tab.icon}
								alt=''
								width={20}
								height={20}
							/>
							<span className='capitalize ml-2'>{tab.title}</span>
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
