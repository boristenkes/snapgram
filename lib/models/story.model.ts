import mongoose from 'mongoose'

const storySchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true
		},
		content: { type: String, required: true },
		views: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
)

const Story = mongoose.models.Story || mongoose.model('Story', storySchema)

export default Story
