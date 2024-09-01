import Chat from '@/lib/models/chat.model'
import Message from '@/lib/models/message.model'
import authOptions from '@/lib/session'
import { NextApiResponseServerIO, User } from '@/lib/types'
import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIO
) {
	if (req.method !== 'POST')
		return res.status(405).json({ error: 'Method Not Allowed' })

	try {
		const session = await getServerSession(req, res, authOptions)

		if (!session || !session.user)
			return res.status(401).json({ error: 'Unauthorized' })

		const currentUser = session?.user as User
		const { message, chatId } = req.body

		if (!message || !chatId || !message.length)
			return res.status(400).json({ error: 'Bad Request' })

		const isCurrentUserPartOfChat = await Chat.exists({
			_id: chatId,
			participants: currentUser._id
		})

		if (!isCurrentUserPartOfChat)
			return res.status(401).json({ error: 'Unauthorized' })

		const newMessage = await Message.create({
			sender: currentUser._id,
			chat: chatId,
			content: message
		})

		await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id })

		const chatKey = `chat:${chatId}:messages`

		res?.socket?.server?.io?.emit(chatKey, newMessage)

		return res.status(200).json(newMessage)
	} catch (error: any) {
		console.log('/api/socket/messages:', error)
		return res.status(500).json({ error: 'Internal Server Error' })
	}
}
