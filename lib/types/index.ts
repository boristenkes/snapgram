import { Session } from 'next-auth'
import { InputHTMLAttributes } from 'react'

export type FormField = InputHTMLAttributes<HTMLInputElement> & {
	name: string
	label?: string
	description?: string
	errors?: string[]
	textarea?: boolean
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
	textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
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

export type UserProfile = { _id: string } & Partial<{
	name: string
	username: string
	email: string
	image: string
	bio: string
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
	seenStories: string[]
	stories: Story[]
	verified: boolean
	onboarded: boolean
}>

export type Story = {
	_id: string
	author: UserProfile
	content: string
	alt?: string
	mentions: UserProfile[]
	tags: string
	views: UserProfile[]
	createdAt: Date
	updatedAt: Date
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
