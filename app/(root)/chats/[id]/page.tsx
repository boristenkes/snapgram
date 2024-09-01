import Avatar from '@/components/avatar'
import ErrorMessage from '@/components/error-message'
import MessageInput from '@/components/message-input'
import MessageList from '@/components/message-list'
import { fetchChat } from '@/lib/actions/chat.actions'
import auth from '@/lib/auth'
import { Chat, User } from '@/lib/types'
import { EllipsisVerticalIcon } from 'lucide-react'
import Link from 'next/link'

type ChatRoomPageProps = {
	params: {
		id: string
	}
}

export default async function ChatRoomPage({
	params: { id }
}: ChatRoomPageProps) {
	const { user: currentUser } = await auth()
	const response = await fetchChat(
		{ _id: id },
		{ populate: ['participants', 'image name username'] }
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	const chat = response.chat as Chat & { participants: User[] }
	const otherParticipant = chat.participants.find(
		p => p._id !== currentUser._id
	) as User

	return (
		<div className='flex flex-col h-full'>
			<header className='flex items-center justify-between border-b border-neutral-600 pb-6'>
				<Link
					href={`/profile/${otherParticipant.username}`}
					className='flex items-center gap-4'
				>
					<Avatar
						url={otherParticipant.image}
						alt={otherParticipant.name}
						width={70}
						className='size-12 lg:size-16'
					/>
					<div>
						<strong className='text-lg lg:text-xl'>
							{otherParticipant.name}
						</strong>
						{/* <p className='text-sm text-neutral-500'>Online</p> */}
					</div>
				</Link>

				<div className='flex items-center gap-4'>
					<EllipsisVerticalIcon
						size={22}
						className='text-neutral-500'
					/>
				</div>
			</header>

			<MessageList chatId={chat._id} />

			<footer className='border-t border-neutral-600 pt-6'>
				<MessageInput chatId={chat._id} />
			</footer>
		</div>
	)
}