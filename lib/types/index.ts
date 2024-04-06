import { Session } from 'next-auth'
import { InputHTMLAttributes } from 'react'

export type TODO = any

export type FormField = InputHTMLAttributes<HTMLInputElement> & {
	name: string
	label?: string
	description?: string
	errors?: string | string[]
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
}

export type SessionType = Session & {
	user: User & {
		id: string
		name: string
		username: string
		email: string
		image: string
	}
}

export type User = {
	_id: string
	name: string
	username: string
	email: string
	image: string
	bio: string
	followRequests: User[] | string[]
	followRequestsCount: number
	followers: User[] | string[]
	followersCount: number
	following: User[] | string[]
	followingCount: number
	highlights: string[]
	likedPosts: Post[] | string[]
	posts: Post[] | string[]
	postsCount: number
	private: boolean
	savedPosts: Post[] | string[]
	seenStories: Story[] | string[]
	stories: Story[] | string[]
	verified: boolean
	onboarded: boolean
}

export type Story = {
	_id: string
	author: User | string
	content: string
	alt?: string
	mentions: User[] | string[]
	tags: string
	views: User[] | string[]
	createdAt: Date
	updatedAt: Date
}

export type Post = {
	_id: string
	author: User
	caption: string
	tags: string[]
	type: 'photo' | 'video' | 'gallery' | 'reel'
	content: string[]
	altText: string
	likes: User[] | string[]
	likeCount: number
	comments: Comment[] | string[]
	commentCount: number
	shares: User[] | string[]
	shareCount: number
	taggedUsers: User[] | string[]
	taggedUsersCount: number
	createdAt: string
	updatedAt: string
}

export type Comment = {
	author: User | string
	postId: string
	content: string
	replies: Comment[] | string[]
	likes: User[]
	likeCount: number
}
