'use client'

import useAuth from '@/hooks/use-auth'
import useChatQuery from '@/hooks/use-chat-query'
import useChatSocket from '@/hooks/use-chat-socket'
import { Message as MessageType } from '@/lib/types'
import { ElementRef, useEffect, useRef } from 'react'
import ErrorMessage from './error-message'
import Loader from './loader'
import Message from './message'

type MessageListProps = {
	chatId: string
}

export default function MessageList({ chatId }: MessageListProps) {
	const { user: currentUser } = useAuth()
	const queryKey = `chat:${chatId}`
	const addKey = `chat:${chatId}:messages`
	const { data, error, isLoading } = useChatQuery({
		queryKey,
		chatId
	})
	useChatSocket({ queryKey, addKey })
	const chatRef = useRef<ElementRef<'div'>>(null)
	const bottomRef = useRef<ElementRef<'div'>>(null)

	if (error) return <ErrorMessage message={error.message} />

	const messages = data?.messages as MessageType[]

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight // scroll to latest message
		}
	}, [data])

	return (
		<div
			ref={chatRef}
			className='flex flex-col gap-5 flex-1 h-1 overflow-y-auto py-5 px-2 custom-scrollbar max-h-[55vh]'
		>
			{isLoading && (
				<div className='w-full h-full grid place-items-center'>
					<Loader size={32} />
				</div>
			)}

			{messages?.map(message => (
				<Message
					key={message._id}
					currentUserId={currentUser._id}
					message={message}
				/>
			))}

			<div ref={bottomRef} />
		</div>
	)
}
