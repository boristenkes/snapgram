import { fetchUsers } from '@/lib/actions/user.actions'
import auth from '@/lib/auth'
import { Eye } from 'lucide-react'
import { Suspense } from 'react'
import UserCardListSkeleton from '../skeletons/user-card-list'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import UserCard from '../user-card'

type Props = {
	views: string[]
}

export default async function StoryViews({ views }: Props) {
	const { user: currentUser } = await auth()

	const filteredViews = views.filter(userId => userId !== currentUser._id)
	const response = await fetchUsers({ _id: { $in: filteredViews } })

	if (!response.success) return

	const storyViews = response.users

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
					className='absolute bottom-4 left-4 space-x-2 w-12'
				>
					<Eye size={18} />
					<span>{storyViews.length}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent side='top'>
				<strong className='block mb-1'>Views</strong>
				<Suspense fallback={<UserCardListSkeleton cardCount={views.length} />}>
					{storyViews.length === 0 && (
						<p className='text-neutral-500 italic'>This story has no views</p>
					)}

					{storyViews.length > 0 && (
						<ul>
							{storyViews.map(user => (
								<li key={user.username}>
									<UserCard user={user} />
								</li>
							))}
						</ul>
					)}
				</Suspense>
			</PopoverContent>
		</Popover>
	)
}
