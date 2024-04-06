import mongoose from 'mongoose'
const { ObjectId } = mongoose.SchemaTypes

const highlightSchema = new mongoose.Schema({
	author: { type: ObjectId, ref: 'User', required: true },
	stories: [{ type: ObjectId, ref: 'Story', required: true }],
	title: { type: String, required: true },
	thumbnail: String
})

const Highlight =
	mongoose.models.Highlight || mongoose.model('Highlight', highlightSchema)

export default Highlight
