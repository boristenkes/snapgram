import mongoose from 'mongoose'

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
	password: { type: String, required: true, minLength: 8 },
	bio: { type: String, maxLength: 500 },
	verified: { type: Boolean, default: false },
	private: { type: Boolean, default: false },
	onboarded: { type: Boolean, default: false },

	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
	postsCount: { type: Number, default: 0 },
	followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	followersCount: { type: Number, default: 0 },
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	followingCount: { type: Number, default: 0 },
	followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	followRequestsCount: { type: Number, default: 0 },

	stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
	seenStories: [
		{
			story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
			seenAt: { type: Date, default: Date.now }
		}
	],
	highlights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Highlight' }],
	savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
	likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
