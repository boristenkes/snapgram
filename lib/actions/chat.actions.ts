'use server'

import Chat from '@/lib/models/chat.model'
import connectMongoDB from '@/lib/mongoose'
import { Chat as ChatType, TODO } from '@/lib/types'
import { SortOrder } from 'mongoose'

type CreateChatProps = {
	participants: string[]
}

export async function createChat({ participants }: CreateChatProps) {
	try {
		await connectMongoDB()

		const chat = await Chat.create({ participants })

		if (!chat) throw new Error('Something went wrong')

		return { success: true, chat }
	} catch (error: any) {
		console.log('`createChat`:', error)
		return { success: false, message: error.message }
	}
}

type FetchChat =
	| { success: true; chat: ChatType }
	| { success: false; message: string }

type FetchChatOptions = {
	select?: string
	populate?: [string, string]
}

export async function fetchChat(
	conditions: Record<string, string>,
	{ select, populate }: FetchChatOptions = {}
): Promise<FetchChat> {
	try {
		await connectMongoDB()

		let query = Chat.findOne(conditions, select)

		if (populate?.length) {
			query = query.populate(populate[0], populate[1])
		}

		const chat = await query.exec()

		if (!chat) throw new Error('Failed to fetch chat')

		return { success: true, chat: JSON.parse(JSON.stringify(chat)) }
	} catch (error: any) {
		console.error('`fetchChat`:', error)
		return { success: false, message: error.message }
	}
}

type FetchChats =
	| { success: true; chats: ChatType[] }
	| { success: false; message: string }

type FetchChatsOptions = FetchChatOptions & {
	sort?: Record<string, SortOrder>
	limit?: number
}

export async function fetchChats(
	conditions?: Record<any, any>,
	{ select, populate, sort, limit }: FetchChatsOptions = {}
): Promise<FetchChats> {
	try {
		await connectMongoDB()

		let query = Chat.find(conditions as TODO, select)

		if (populate?.length) query.populate(populate[0], populate[1])

		if (sort) query.sort(sort)

		if (typeof limit === 'number') query.limit(limit)

		const chats = await query.exec()

		if (!chats) throw new Error('Failed to fetch chats')

		return { success: true, chats: JSON.parse(JSON.stringify(chats)) }
	} catch (error: any) {
		console.log('`fetchChats`:', error)
		return { success: false, message: error.message }
	}
}
