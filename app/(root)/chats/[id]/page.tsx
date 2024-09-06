import Avatar from '@/components/avatar'
import ChatMessages from '@/components/chat-messages'
import DeleteChatButton from '@/components/delete-chat-button'
import ErrorMessage from '@/components/error-message'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size='icon'
								variant='ghost'
							>
								<EllipsisVerticalIcon
									size={22}
									className='text-neutral-500'
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='border border-neutral-600'
						>
							<DropdownMenuItem>
								<DeleteChatButton chatId={chat._id} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			<ChatMessages chatId={chat._id} />
		</div>
	)
}
