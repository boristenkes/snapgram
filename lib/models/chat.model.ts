import mongoose from 'mongoose'
const { ObjectId } = mongoose.SchemaTypes

const chatSchema = new mongoose.Schema(
	{
		participants: [{ type: ObjectId, ref: 'User', required: true }],
		lastMessage: { type: ObjectId, ref: 'Message' }
	},
	{ timestamps: true }
)

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)

export default Chat
