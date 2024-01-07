import { Session } from 'next-auth'
import { InputHTMLAttributes } from 'react'

export type FormField = InputHTMLAttributes<HTMLInputElement> & {
	name: string
	label?: string
	errors: string[]
}

export type SessionType = Session & {
	user: UserProfile & {
		id: string
		name: string
		username: string
		email: string
		image: string
	}
}

export type UserProfile = {
	_id: string
	name: string
	username: string
	email: string
	image: string
	bio?: string
	followRequests: UserProfile[]
	followRequestsCount: number
	followers: UserProfile[]
	followersCount: number
	following: UserProfile[]
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
	onboarded: boolean
}

export type Post = {
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

export type Comment = {
	author: UserProfile
	postId: string
	content: string
	replies: Comment[]
	likes: UserProfile[]
	likesCount: number
}
