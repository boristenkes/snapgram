'use client'

import { useSocket } from '@/components/socket-provider'
import { Message } from '@/lib/types'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

type ChatSocketProps = {
	addKey: string
	queryKey: string
}

type QueryData =
	| { success: true; messages: Message[] }
	| { success: false; message: string }

export default function useChatSocket({ addKey, queryKey }: ChatSocketProps) {
	const { socket } = useSocket()
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!socket) return

		socket.on(addKey, (newMessage: Message) => {
			queryClient.setQueryData([queryKey], (oldData: QueryData) => {
				if (oldData.success) {
					return { success: true, messages: [...oldData.messages, newMessage] }
				}
			})
		})

		return () => {
			socket.off(addKey)
		}
	}, [queryClient, addKey, queryKey, socket])
}
