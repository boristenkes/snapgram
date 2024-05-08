import FollowButton from '@/components/follow-button'
import { fetchUsers } from '@/lib/actions/user.actions'
import { formatDistanceToNowStrict } from 'date-fns'

type NewFollowerContentProps = {
	senderName: string
	createdAt: Date | string
	senderId: string
	recipientId: string
}

export default async function NewFollowerContent({
	senderName,
	createdAt,
	senderId,
	recipientId
}: NewFollowerContentProps) {
	const usersResponse = await fetchUsers(
		{ _id: { $in: [senderId, recipientId] } },
		{ limit: 2 }
	)

	return (
		<div className='flex items-center justify-between w-full'>
			<div>
				<p className='font-semibold text-sm sm:text-lg'>
					{senderName} followed you
				</p>
				<small className='text-neutral-500'>
					{formatDistanceToNowStrict(new Date(createdAt), {
						addSuffix: true
					})}
				</small>
			</div>

			{usersResponse.success && (
				<FollowButton
					currentUserStr={JSON.stringify(usersResponse.users[0])}
					targetUserStr={JSON.stringify(usersResponse.users[1])}
				/>
			)}
		</div>
	)
}
