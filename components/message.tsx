import { Message as MessageType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

type MessageProps = {
	currentUserId: string
	message: MessageType
}

export default function Message({ currentUserId, message }: MessageProps) {
	const isMessageFromCurrentUser = message.sender === currentUserId
	const formattedTime = formatDistanceToNow(message.createdAt, {
		addSuffix: true
	})

	return (
		<div>
			<p
				className={cn(
					'p-4 rounded-lg w-fit max-w-[80%] relative',
					isMessageFromCurrentUser ? 'bg-primary-600 ml-auto' : 'bg-neutral-600'
				)}
			>
				{message.content}
			</p>

			<time
				dateTime={message.createdAt.toString()}
				className={cn('text-sm text-neutral-500 mt-1', {
					'w-fit block ml-auto': isMessageFromCurrentUser
				})}
			>
				{formattedTime}
			</time>
		</div>
	)
}
