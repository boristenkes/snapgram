import { createChat, fetchNewChats } from '@/lib/actions/chat.actions'
import { PlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import SubmitButton from './elements/submit-button'
import ErrorMessage from './error-message'
import Loader from './loader'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from './ui/dialog'
import UserCard from './user-card'

type Props = {
	currentUserId: string
}

export default async function NewChatList({ currentUserId }: Props) {
	const response = await fetchNewChats()

	if (!response.success) return <ErrorMessage message={response.message} />

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
				>
					<PlusIcon size={24} />
				</Button>
			</DialogTrigger>

			<DialogContent className='bg-[#09090A] w-[min(30rem,100%-2rem)] py-5 px-4 sm:py-9 sm:px-7 mx-auto rounded-2xl border-2 border-neutral-700'>
				<DialogHeader>
					<DialogTitle>New chat</DialogTitle>
					<DialogDescription>Start a new conversation</DialogDescription>
				</DialogHeader>

				<ul>
					{response.users.map(user => (
						<li
							key={user._id}
							className='flex items-center justify-between'
						>
							<UserCard user={user} />

							<MessageButton
								targetUserId={user._id}
								currentUserId={currentUserId}
							/>
						</li>
					))}
				</ul>
			</DialogContent>
		</Dialog>
	)
}

function MessageButton({
	currentUserId,
	targetUserId
}: {
	currentUserId: string
	targetUserId: string
}) {
	const handleMessageClick = async () => {
		'use server'

		let redirectPath = `/profile/${targetUserId}`

		try {
			const response = await createChat({
				participants: [targetUserId, currentUserId]
			})

			if (!response.success) throw new Error(response.message)

			redirectPath = `/chats/${response.chat._id}`

			redirect(redirectPath)
		} catch (error: any) {
			if (error.message === 'NEXT_REDIRECT') redirect(redirectPath)
			console.log(error)
		}
	}

	return (
		<form action={handleMessageClick}>
			<SubmitButton
				pendingContent={<Loader className='mx-auto text-center' />}
				variant='ghost'
				size='sm'
			>
				Message
			</SubmitButton>
		</form>
	)
}
