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
	followRequests: (User | string)[]
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
	createdAt: Date | string
	updatedAt: Date | string
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
	mentions: User[] | string[]
	createdAt: Date | string
	updatedAt: Date | string
}

export type Comment = {
	_id: string
	author: User | string
	postId: string
	parentCommentId: string
	content: string
	replies: Comment[] | string[]
	likes: string[]
	likeCount: number
	isReply: boolean
	createdAt: Date
}

export type OptimisticReply = Omit<Comment, '_id' | 'replies' | 'isReply'> & {
	pending?: boolean
}

export type SearchParams = Record<string, string | string[] | undefined>

type NotificationRoot = {
	_id: string
	type: string
	sender: User | string
	recipient: User | string
	seen?: boolean
	createdAt: Date | string
}

type LikedPostNotification = {
	type: 'LIKED_POST'
	postId: string
}

type NewCommentNotification = {
	type: 'NEW_COMMENT'
	commentContent: string
	postId: string
}

type PostMentionNotification = {
	type: 'POST_MENTION'
	commentContent: string
	postId: string
}

type NewFollowerNotification = {
	type: 'NEW_FOLLOWER'
}

type NewFollowRequestNotification = {
	type: 'NEW_FOLLOW_REQUEST'
}

export type Notification = NotificationRoot &
	(
		| LikedPostNotification
		| NewCommentNotification
		| PostMentionNotification
		| NewFollowerNotification
		| NewFollowRequestNotification
	)
