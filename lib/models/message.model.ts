import mongoose from 'mongoose'
const { ObjectId } = mongoose.SchemaTypes

const messageSchema = new mongoose.Schema(
	{
		chat: { type: ObjectId, ref: 'Chat', required: true },
		sender: { type: ObjectId, ref: 'User', required: true },
		content: { type: String, required: true }
	},
	{ timestamps: true }
)

const Message =
	mongoose.models.Message || mongoose.model('Message', messageSchema)

export default Message
