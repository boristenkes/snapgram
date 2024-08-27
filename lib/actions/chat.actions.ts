'use server'

import Chat from '@/lib/models/chat.model'
import connectMongoDB from '@/lib/mongoose'
import { Chat as ChatType, TODO, User as UserType } from '@/lib/types'
import { SortOrder } from 'mongoose'
import auth from '../auth'
import Message from '../models/message.model'
import User from '../models/user.model'

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

type FetchNewChats =
	| { success: true; users: UserType[] }
	| { success: false; message: string }

export async function fetchNewChats(): Promise<FetchNewChats> {
	try {
		await connectMongoDB()

		const { user: currentUser } = await auth()

		const usedChats = (
			await Chat.find({ participants: currentUser._id }).select('participants')
		).map(chat =>
			chat.participants.find((userId: string) => userId !== currentUser._id)
		)

		const newChats = await User.find({
			_id: { $nin: [...usedChats, currentUser._id] }
		}).select('image name username')

		return { success: true, users: JSON.parse(JSON.stringify(newChats)) }
	} catch (error: any) {
		console.log('`fetchNewChats`:', error)
		return { success: false, message: error.message }
	}
}

export async function deleteChat(chatId: string) {
	try {
		await connectMongoDB()

		const session = await auth()

		if (!session) throw new Error('Unauthorized')

		const { user: currentUser } = session

		const chat = await Chat.findById(chatId)

		if (!chat) throw new Error('Chat not found')

		if (
			!chat.participants.some(
				(participantId: string) => participantId !== currentUser._id
			)
		) {
			throw new Error('Unauthorized')
		}

		const [deleteResponse] = await Promise.all([
			Chat.deleteOne({ _id: chatId }),
			Message.deleteMany({ chat: chatId })
		])

		if (deleteResponse.deletedCount === 0)
			throw new Error('Failed to delete chat')

		return { success: true, message: 'Successfully deleted chat' }
	} catch (error: any) {
		console.log('`deleteChat`:', error)
		return { success: false, message: error.message }
	}
}
