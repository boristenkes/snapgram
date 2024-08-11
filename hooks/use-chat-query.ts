'use client'

import { fetchChatMessages } from '@/lib/actions/message.actions'
import { useQuery } from '@tanstack/react-query'

type ChatQueryProps = {
	queryKey: string
	chatId: string
}

export default function useChatQuery({ queryKey, chatId }: ChatQueryProps) {
	const queryResp = useQuery({
		queryKey: [queryKey],
		queryFn: () => fetchChatMessages(chatId)
	})

	return queryResp
}
