import { fetchChats } from '@/lib/actions/chat.actions'
import { Chat, User } from '@/lib/types'
import { EllipsisIcon } from 'lucide-react'
import Link from 'next/link'
import Avatar from './avatar'
import DeleteChatButton from './delete-chat-button'
import ErrorMessage from './error-message'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from './ui/dropdown-menu'

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
					<li
						key={chat._id}
						className='group flex items-center hover:bg-neutral-700/90 transition-colors pr-4'
					>
						<Link
							href={`/chats/${chat._id}`}
							className='flex items-center flex-1 gap-2 p-4 pr-0 rounded-lg'
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

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size='icon'
									variant='ghost'
									className='transition-opacity opacity-0 group-hover:opacity-100'
								>
									<EllipsisIcon size={16} />
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
					</li>
				)
			})}
		</ul>
	)
}
