'use server'

import Message from '@/lib/models/message.model'
import connectMongoDB from '@/lib/mongoose'
import { Message as MessageType, TODO } from '@/lib/types'
import { SortOrder } from 'mongoose'
import auth from '../auth'

type CreateMessageProps = {
	chatId: string
	content: string
}

export async function createMessage({ chatId, content }: CreateMessageProps) {
	try {
		await connectMongoDB()

		const { user: currentUser } = await auth()

		const message = await Message.create({
			chat: chatId,
			sender: currentUser._id,
			content
		})

		if (!message) throw new Error('Something went wrong')

		return { success: true, message }
	} catch (error: any) {
		return { success: false, message: error.message }
	}
}

type FetchMessage =
	| { success: true; message: MessageType }
	| { success: false; message: string }

type FetchMessageOptions = {
	select?: string
	populate?: [string, string]
}

export async function fetchMessage(
	conditions: Record<string, string>,
	{ select, populate }: FetchMessageOptions = {}
): Promise<FetchMessage> {
	try {
		await connectMongoDB()

		let query = Message.findOne(conditions, select)

		if (populate?.length) {
			query = query.populate(populate[0], populate[1])
		}

		const message = await query.exec()

		if (!message) throw new Error('Failed to fetch message')

		return { success: true, message: JSON.parse(JSON.stringify(message)) }
	} catch (error: any) {
		console.error('`fetchMessage`:', error)
		return { success: false, message: error.message }
	}
}

type FetchMessages =
	| { success: true; messages: MessageType[] }
	| { success: false; message: string }

type FetchMessagesOptions = FetchMessageOptions & {
	sort?: Record<string, SortOrder>
	limit?: number
}

export async function fetchMessages(
	conditions?: Record<any, any>,
	{ select, populate, sort, limit }: FetchMessagesOptions = {}
): Promise<FetchMessages> {
	try {
		await connectMongoDB()

		let query = Message.find(conditions as TODO, select)

		if (populate?.length) query.populate(populate[0], populate[1])

		if (sort) query.sort(sort)

		if (typeof limit === 'number') query.limit(limit)

		const messages = await query.exec()

		if (!messages) throw new Error('Failed to fetch messages')

		return { success: true, messages: JSON.parse(JSON.stringify(messages)) }
	} catch (error: any) {
		console.log('`fetchMessages`:', error)
		return { success: false, message: error.message }
	}
}

export async function fetchChatMessages(chatId: string) {
	try {
		await connectMongoDB()

		const response = await fetchMessages(
			{ chat: chatId },
			{ sort: { createdAt: 'asc' } }
		)

		if (!response.success) throw new Error(response.message)

		return { success: true, messages: response.messages }
	} catch (error: any) {
		console.log('`fetchChatMessages`:', error)
		return { success: false, message: error.message }
	}
}