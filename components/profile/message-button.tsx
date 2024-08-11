import { createChat } from '@/lib/actions/chat.actions'
import auth from '@/lib/auth'
import Chat from '@/lib/models/chat.model'
import { User } from '@/lib/types'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '../ui/button'

type MessageButtonProps = {
	targetUser: User
}

export default async function MessageButton({
	targetUser
}: MessageButtonProps) {
	const { user: currentUser } = await auth()
	const existingChat = await Chat.exists({
		participants: { $all: [currentUser._id, targetUser._id] }
	})

	if (existingChat?._id) {
		return (
			<Button
				size='lg'
				className='grow bg-neutral-200 border-neutral-200 text-neutral-700 hover:bg-neutral-200/90'
				asChild
			>
				<Link href={`/chats/${existingChat._id}`}>Message</Link>
			</Button>
		)
	}

	const handleMessageClick = async () => {
		'use server'

		let redirectPath = `/profile/${targetUser._id}`

		try {
			const response = await createChat({
				participants: [targetUser._id, currentUser._id]
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
			<Button
				size='lg'
				className='grow bg-neutral-200 border-neutral-200 text-neutral-700 hover:bg-neutral-200/90'
			>
				Message
			</Button>
		</form>
	)
}
