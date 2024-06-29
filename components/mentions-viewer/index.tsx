import { fetchUsers } from '@/lib/actions/user.actions'
import { User } from '@/lib/types'
import Image from 'next/image'
import { Suspense } from 'react'
import ErrorMessage from '../error-message'
import UserCardListSkeleton from '../skeletons/user-card-list'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import UserCard from '../user-card'

export default async function MentionsViewer({
	mentions
}: {
	mentions: string[]
}) {
	return (
		<Popover>
			<PopoverTrigger
				className='absolute bottom-4 left-4 bg-neutral-800 p-2 aspect-square rounded-full'
				aria-label='View mentioned users'
			>
				<Image
					src='/assets/icons/user.svg'
					alt=''
					width={16}
					height={16}
				/>
			</PopoverTrigger>

			<PopoverContent side='top'>
				<strong className='block mb-1'>Mentioned users</strong>
				<Suspense
					fallback={<UserCardListSkeleton cardCount={mentions.length} />}
				>
					{fetchUsers({ _id: { $in: mentions } }).then(response =>
						response.success ? (
							<ul>
								{(response.users as User[]).map(user => (
									<li key={user.username}>
										<UserCard user={user} />
									</li>
								))}
							</ul>
						) : (
							<ErrorMessage message={response.message} />
						)
					)}
				</Suspense>
			</PopoverContent>
		</Popover>
	)
}
