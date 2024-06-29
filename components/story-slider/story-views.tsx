import useAuth from '@/hooks/use-auth'
import { fetchUsers } from '@/lib/actions/user.actions'
import { User } from '@/lib/types'
import { Eye } from 'lucide-react'
import { Suspense } from 'react'
import ErrorMessage from '../error-message'
import UserCardListSkeleton from '../skeletons/user-card-list'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import UserCard from '../user-card'

type Props = {
	views: string[]
}

export default function StoryViews({ views }: Props) {
	const { user: currentUser } = useAuth()
	const filteredViews = views.filter(userId => userId !== currentUser._id)

	return (
		<Popover>
			<PopoverTrigger>
				<Button
					size='icon'
					variant='ghost'
					className='absolute bottom-4 left-4 space-x-2 w-12'
				>
					<Eye size={18} />
					<span>{filteredViews.length}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent side='top'>
				<strong className='block mb-1'>Views</strong>
				<Suspense fallback={<UserCardListSkeleton cardCount={views.length} />}>
					{filteredViews.length === 0 && (
						<p className='text-neutral-500 italic'>This story has no views</p>
					)}

					{filteredViews.length > 0 &&
						fetchUsers({ _id: { $in: filteredViews } }).then(response => {
							if (!response.success)
								return <ErrorMessage message={response.message} />


							return (
								<ul>
									{(response.users as User[]).map(user => (
										<li key={user.username}>
											<UserCard user={user} />
										</li>
									))}
								</ul>
							)
						})}
				</Suspense>
			</PopoverContent>
		</Popover>
	)
}
