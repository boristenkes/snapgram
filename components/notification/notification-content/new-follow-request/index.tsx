import { formatDistanceToNowStrict } from 'date-fns'
import AcceptFollowerButton from './accept-follower-button'
import RejectFollowerButton from './reject-follower-button'

type NewFollowerContentProps = {
	senderName: string
	createdAt: Date | string
	senderId: string
	recipientId: string
}

export default async function NewFollowRequestContent({
	senderName,
	createdAt,
	senderId,
	recipientId
}: NewFollowerContentProps) {
	return (
		<div className='flex items-center justify-between w-full'>
			<div>
				<p className='font-semibold text-sm sm:text-lg'>
					{senderName} requested to follow you
				</p>
				<small className='text-neutral-500'>
					{formatDistanceToNowStrict(new Date(createdAt), {
						addSuffix: true
					})}
				</small>
			</div>

			<div className='flex items-center gap-2'>
				<AcceptFollowerButton
					senderId={senderId}
					recipientId={recipientId}
					className='h-8 rounded-md px-3 text-xs'
				/>

				<RejectFollowerButton
					senderId={senderId}
					recipientId={recipientId}
					className='h-8 rounded-md px-3 text-xs bg-neutral-600 text-neutral-100 hover:bg-neutral-600/90'
				/>
			</div>
		</div>
	)
}
