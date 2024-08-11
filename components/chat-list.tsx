import { fetchChats } from '@/lib/actions/chat.actions'
import { Chat, User } from '@/lib/types'
import Link from 'next/link'
import Avatar from './avatar'
import ErrorMessage from './error-message'

type ChatListProps = {
	userId: string
}

export default async function ChatList({ userId }: ChatListProps) {
	const response = await fetchChats(
		{ participants: userId },
		{ populate: ['participants', 'image name username'] }
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	const chats = response.chats as (Chat & { participants: User[] })[]

	return (
		<ul className='divide-y divide-neutral-600'>
			{chats.map(chat => {
				const otherParticipant =
					chat.participants[0]._id === userId
						? chat.participants[1]
						: chat.participants[0]

				return (
					<li key={chat._id}>
						<Link
							href={`/chats/${chat._id}`}
							className='flex items-center gap-2 hover:bg-neutral-700/90 p-4 rounded-lg transition-colors'
						>
							<Avatar
								url={otherParticipant.image}
								alt={otherParticipant.name}
								width={50}
							/>
							<div>
								<strong>{otherParticipant.name}</strong>
								<p className='text-sm text-neutral-500'>
									@{otherParticipant.username}
								</p>
							</div>
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
