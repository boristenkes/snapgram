import mongoose from 'mongoose'
import { notificationTypes } from '@/constants'
const { ObjectId } = mongoose.SchemaTypes
{
	;['LIKED_POST', 'NEW_COMMENT', 'NEW_FOLLOWER', 'NEW_FOLLOW_REQUEST']
}

const notificationSchema = new mongoose.Schema(
	{
		// global fields
		type: { type: String, enum: notificationTypes },
		sender: { type: ObjectId, ref: 'User' },
		recipient: { type: ObjectId, ref: 'User' },
		seen: { type: Boolean, default: false },

		// LIKED_POST
		postId: { type: ObjectId, ref: 'Post' },
		postCaption: String,

		// NEW_COMMENT (postId)
		commentContent: String

		// NEW_FOLLOWER (no additional fields)

		// NEW_FOLLOW_REQUEST (no additional fields)
	},
	{
		timestamps: true
	}
)

const Notification =
	mongoose.models.Notification ||
	mongoose.model('Notification', notificationSchema)

export default Notification
