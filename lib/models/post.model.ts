import mongoose from 'mongoose'
const { ObjectId } = mongoose.SchemaTypes

const postSchema = new mongoose.Schema(
	{
		author: { type: ObjectId, ref: 'User' },
		caption: String,
		tags: [String],
		mentions: [{ type: ObjectId, ref: 'User' }],
		content: [{ type: String, required: true }],
		altText: { type: String, default: '' },

		likes: [{ type: ObjectId, ref: 'User' }],
		likeCount: { type: Number, default: 0 },
		// comments: [{ type: ObjectId, ref: 'Comment' }],
		commentCount: { type: Number, default: 0 },
		shares: [{ type: ObjectId, ref: 'User' }],
		shareCount: { type: Number, default: 0 }
	},
	{
		timestamps: true
	}
)

const Post = mongoose.models.Post || mongoose.model('Post', postSchema)

export default Post
