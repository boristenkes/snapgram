import mongoose from 'mongoose'
import { Story } from '../types'

const storySchema = new mongoose.Schema<Story>(
	{
		author: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true
		},
		content: { type: String, required: true },
		alt: { type: String, default: '' },
		mentions: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
		tags: [String],
		views: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User'
			}
		]
	},
	{
		timestamps: true
	}
)

const Story = mongoose.models.Story || mongoose.model('Story', storySchema)

export default Story
