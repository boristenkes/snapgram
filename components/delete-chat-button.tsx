import { deleteChat } from '@/lib/actions/chat.actions'
import { redirect } from 'next/navigation'

type Props = {
	chatId: string
}

export default function DeleteChatButton({ chatId }: Props) {
	const handleDeleteChatClick = async () => {
		'use server'

		try {
			const response = await deleteChat(chatId)

			if (!response.success) throw new Error(response.message)

			redirect('/chats')
		} catch (error: any) {
			if (error.message === 'NEXT_REDIRECT') redirect('/chats')
			console.log(error)
		}
	}

	return (
		<form
			action={handleDeleteChatClick}
			className='w-full'
		>
			<button className='w-full text-left'>Delete</button>
		</form>
	)
}
