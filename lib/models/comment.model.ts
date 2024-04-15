import mongoose from 'mongoose'
const { ObjectId } = mongoose.SchemaTypes

const commentSchema = new mongoose.Schema(
	{
		author: { type: ObjectId, ref: 'User' },
		postId: { type: ObjectId, ref: 'Post' },
		likes: [{ type: ObjectId, ref: 'User' }],
		likeCount: { type: Number, default: 0 },
		replies: [{ type: ObjectId, ref: 'Comment' }],
		content: { type: String, required: true, trim: true },
		isReply: { type: Boolean, default: false }
	},
	{
		timestamps: true
	}
)

const Comment =
	mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment
