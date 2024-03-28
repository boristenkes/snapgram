import mongoose from 'mongoose'
const { ObjectId } = mongoose.SchemaTypes

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		trim: true,
		minlength: 3,
		maxlength: 30,
		lowercase: true
	},
	name: String,
	image: String,
	email: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, minLength: 8 },
	bio: { type: String, maxLength: 500 },
	verified: { type: Boolean, default: false },
	private: { type: Boolean, default: false },
	onboarded: { type: Boolean, default: false },

	posts: [{ type: ObjectId, ref: 'Post' }],
	postsCount: { type: Number, default: 0, min: 0 },
	savedPosts: [{ type: ObjectId, ref: 'Post' }],
	likedPosts: [{ type: ObjectId, ref: 'Post' }],

	followers: [{ type: ObjectId, ref: 'User' }],
	followersCount: { type: Number, default: 0, min: 0 },
	following: [{ type: ObjectId, ref: 'User' }],
	followingCount: { type: Number, default: 0, min: 0 },
	followRequests: [{ type: ObjectId, ref: 'User' }],
	followRequestsCount: { type: Number, default: 0, min: 0 },

	seenStories: [{ type: ObjectId, ref: 'Story' }],
	highlights: [{ type: ObjectId, ref: 'Highlight' }]
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
