'use client'

import { fetchChats } from '@/lib/actions/chat.actions'
import { Chat, User } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Loader2Icon, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Avatar from './avatar'
import ErrorMessage from './error-message'
import { Button } from './ui/button'
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
	const { data, error, isLoading } = useQuery({
		queryKey: [`chats:${currentUserId}`],
		queryFn: async () =>
			await fetchChats(
				{ participants: currentUserId },
				{ populate: ['participants', 'image name username'] }
			)
	})
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
						{(data.chats as (Chat & { participants: User[] })[]).map(chat => {
							const otherParticipant =
								chat.participants[0]._id === currentUserId
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
				)}
			</SheetContent>
		</Sheet>
	)
}
