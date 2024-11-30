'use client'

import { fetchUserChats } from '@/lib/actions/chat.actions'
import { Chat, Message, User } from '@/lib/types'
import { EllipsisIcon, Loader2Icon, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Avatar from './avatar'
import ErrorMessage from './error-message'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from './ui/dropdown-menu'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from './ui/sheet'

export default function MobileChatList({
	currentUserId
}: {
	currentUserId: string
}) {
	const [open, setOpen] = useState(false)
	const { data, error, isLoading } = useSWR(`chats:${currentUserId}`, () =>
		fetchUserChats(currentUserId)
	)
	const pathname = usePathname()

	useEffect(() => {
		setOpen(false)
	}, [pathname])

	return (
		<Sheet
			open={open}
			onOpenChange={setOpen}
		>
			<SheetTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
				>
					<Menu
						size={24}
						className=''
					/>
				</Button>
			</SheetTrigger>
			<SheetContent side='left'>
				{isLoading && (
					<Loader2Icon
						size={16}
						className='block m-auto animate-spin'
					/>
				)}

				<SheetHeader className='text-left mb-4'>
					<SheetTitle>Chats</SheetTitle>
					<SheetDescription>Talk to other users in real-time</SheetDescription>
				</SheetHeader>

				{error && <ErrorMessage message={error.message} />}

				{data?.success && (
					<ul className='divide-y divide-neutral-600'>
						{(
							data.chats as (Chat & {
								participants: User[]
								lastMessage: Message
							})[]
						).map(chat => {
							const otherParticipant =
								chat.participants[0]._id === currentUserId
									? chat.participants[1]
									: chat.participants[0]

							return (
								<li
									key={chat._id}
									className='flex items-center hover:bg-neutral-700/90 transition-colors pr-4'
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
											<p className='text-sm text-neutral-500 line-clamp-1'>
												{chat.lastMessage?.sender === currentUserId
													? `You: ${chat.lastMessage?.content}`
													: chat.lastMessage?.content}
											</p>
										</div>
									</Link>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												size='icon'
												variant='ghost'
											>
												<EllipsisIcon size={16} />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuItem>Delete</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</li>
							)
						})}
					</ul>
				)}
			</SheetContent>
		</Sheet>
	)
}
