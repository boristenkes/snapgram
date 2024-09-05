'use client'

import { TextInput } from '@/components/elements'
import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/use-auth'
import { fetchChatMessages, sendMessage } from '@/lib/actions/message.actions'
import { pusherClient } from '@/lib/pusher'
import toast from '@/lib/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendIcon } from 'lucide-react'
import { ElementRef, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import { z } from 'zod'
import ErrorMessage from './error-message'
import Message from './message'

const messageFormSchema = z.object({
	message: z.string().min(1)
})

export default function ChatMessages({ chatId }: { chatId: string }) {
	const { user: currentUser } = useAuth()
	const {
		data: recentMessages,
		error,
		isLoading,
		mutate
	} = useSWR(`chat:${chatId}:messages`, () => fetchChatMessages(chatId))
	const form = useForm<z.infer<typeof messageFormSchema>>({
		defaultValues: { message: '' },
		resolver: zodResolver(messageFormSchema)
	})
	const {
		formState: { isSubmitting }
	} = form

	const chatRef = useRef<ElementRef<'div'>>(null)

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight // scroll to latest message
		}
	}, [recentMessages])

	useEffect(() => {
		const channel = pusherClient.subscribe(chatId)

		const newMessageHandler = () => mutate()

		channel.bind('message:new', newMessageHandler)

		return () => {
			pusherClient.unsubscribe(chatId)
			channel.unbind('message:new', newMessageHandler)
		}
	}, [])

	const onSubmit = async (values: z.infer<typeof messageFormSchema>) => {
		try {
			const response = await sendMessage({ chatId, content: values.message })

			if (!response.success) throw new Error(response.message)

			form.reset()
		} catch (error: any) {
			console.error(error)
			toast('Failed to send message', { type: 'error' })
		}
	}

	return (
		<>
			<div
				ref={chatRef}
				className='flex flex-col gap-5 flex-1 h-1 overflow-y-auto py-5 px-2 custom-scrollbar max-h-[55vh]'
			>
				{isLoading && (
					<div className='w-full h-full grid place-items-center'>
						<Loader size={32} />
					</div>
				)}

				{error && <ErrorMessage message={error.message} />}

				{recentMessages?.map(message => (
					<Message
						key={message._id}
						currentUserId={currentUser._id}
						message={message}
					/>
				))}
			</div>

			<footer className='border-t border-neutral-600 pt-6'>
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
			</footer>
		</>
	)
}
