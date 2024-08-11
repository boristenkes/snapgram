'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SendIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TextInput } from './elements'
import Loader from './loader'
import { Button } from './ui/button'

type MessageInputProps = { chatId: string }

const messageFormSchema = z.object({
	message: z.string().min(1)
})

export default function MessageInput({ chatId }: MessageInputProps) {
	const form = useForm<z.infer<typeof messageFormSchema>>({
		defaultValues: { message: '' },
		resolver: zodResolver(messageFormSchema)
	})
	const {
		formState: { isSubmitting }
	} = form

	const onSubmit = async (data: z.infer<typeof messageFormSchema>) => {
		try {
			const response = await fetch('/api/socket/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message: data.message, chatId })
			})

			if (!response.ok) {
				throw new Error(
					`Failed to send message. Server responsed with ${response.status}: ${response.statusText}`
				)
			}

			// const newMessage = await response.json()

			form.reset()
		} catch (error: any) {
			console.error(error)
		}
	}

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='flex items-center gap-2'
		>
			<TextInput
				placeholder='Write your message here...'
				className='grow'
				disabled={isSubmitting}
				{...form.register('message')}
			/>
			<Button
				aria-label='send'
				disabled={isSubmitting}
			>
				{isSubmitting ? <Loader size={16} /> : <SendIcon size={16} />}
			</Button>
		</form>
	)
}
