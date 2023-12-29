import { Session, User } from 'next-auth'

type FormField = {
	type: string
	name: string
	label: string
	required: boolean
	errors: string[]
}

export type SessionType = Session & {
	user: UserProfile & {
		id: string
		name: string
		username: string
		email: string
		avatarUrl: string
	}
}

type UserProfile = {
	_id: string
	name: string
	username: string
	email: string
	image: string
	followRequests: string[]
	followRequestsCount: number
	followers: string[]
	followersCount: number
	following: string[]
	followingCount: number
	highlights: string[]
	likedPosts: Post[]
	posts: Post[]
	postsCount: number
	private: boolean
	savedPosts: Post[]
	seenStories: any[]
	stories: any[]
	verified: boolean
}

type Post = {
	author: UserProfile
	caption: string
	tags: string[]
	type: 'photo' | 'video' | 'gallery' | 'reel'
	content: string
	altText?: string
	likes: UserProfile[]
	likeCount: number
	comments: Comment[]
	commentCount: number
	shares: UserProfile[]
	shareCount: number
	taggedUsers: UserProfile[]
	taggedUsersCount: number
}

type Comment = {
	author: UserProfile
	postId: string
	content: string
	replies: Comment[]
	likes: UserProfile[]
	likesCount: number
}
