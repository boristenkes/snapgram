'use server'

import { revalidatePath } from 'next/cache'
import Comment from '../models/comment.model'
import { Comment as CommentType } from '../types'
import connectMongoDB from '../mongoose'
import { getCurrentUser } from '../session'
import { SortOrder } from 'mongoose'
import { TODO } from '../types'
import User from '../models/user.model'
import Post from '../models/post.model'
import { sendNotification } from './notification.actions'

type CreateCommentProps = {
	content: string
	postId: string
	pathname?: string
}

export async function createComment({
	content,
	postId,
	pathname = '/'
}: CreateCommentProps) {
	try {
		await connectMongoDB()

		const { user: currentUser } = await getCurrentUser()

		if (!currentUser) throw new Error('You must be logged in to create comment')

		const newComment = await Comment.create({
			content,
			postId,
			author: currentUser._id
		})

		const post = await Post.findById(newComment.postId).select(
			'commentCount author'
		)

		post.commentCount++

		await Promise.all([
			post.save(),

			sendNotification({
				sender: currentUser._id,
				recipient: post.author,
				type: 'NEW_COMMENT',
				// @ts-ignore
				commentContent: content,
				postId: postId
			})
		])

		revalidatePath(pathname)

		return { success: true, message: 'Successfully commented post' }
	} catch (error: any) {
		return { success: false, message: error.message }
	}
}

type FetchComment =
	| { success: true; comment: CommentType }
	| { success: false; message: string }

type FetchCommentOptions = {
	select?: string
	populate?: (string | Record<string, any>)[]
}

export async function fetchComment(
	conditions: Record<string, string>,
	{ select, populate }: FetchCommentOptions = {}
): Promise<FetchComment> {
	try {
		await connectMongoDB()

		let query = Comment.findOne(conditions, select)

		if (populate?.length) {
			if (typeof populate[0] === 'string') {
				// @ts-ignore
				query.populate(...populate)
			} else {
				// @ts-ignore
				query.populate(populate)
			}
		}

		const comment = await query.exec()

		if (!comment) throw new Error('Failed to fetch comment')

		return { success: true, comment: JSON.parse(JSON.stringify(comment)) }
	} catch (error: any) {
		console.error('`fetchComment`:', error)
		return { success: false, message: error.message }
	}
}

type FetchComments =
	| { success: true; comments: CommentType[] }
	| { success: false; message: string }

type FetchCommentsOptions = FetchCommentOptions & {
	sort?: Record<string, SortOrder>
	limit?: number
}

export async function fetchComments(
	conditions?: Record<any, any>,
	{ select, populate, sort, limit }: FetchCommentsOptions = {}
): Promise<FetchComments> {
	try {
		await connectMongoDB()

		let query = Comment.find(conditions as TODO, select)

		if (populate?.length) {
			if (typeof populate[0] === 'string') {
				// @ts-ignore
				query.populate(...populate)
			} else {
				// @ts-ignore
				query.populate(populate)
			}
		}

		if (sort) query.sort(sort)

		if (typeof limit === 'number') query.limit(limit)

		const comments = await query.exec()

		if (!comments) throw new Error('Failed to fetch comments')

		return { success: true, comments: JSON.parse(JSON.stringify(comments)) }
	} catch (error: any) {
		console.log('`fetchComments`:', error)
		return { success: false, message: error.message }
	}
}

type ToggleCommentLikeProps = {
	currentUserId: string
	commentId: string
}

export async function toggleCommentLike({
	currentUserId,
	commentId
}: ToggleCommentLikeProps) {
	try {
		await connectMongoDB()

		const [currentUser, comment] = await Promise.all([
			User.findById(currentUserId),
			Comment.findById(commentId)
		])

		if (!currentUser || !comment) throw new Error('Something went wrong.')

		const isLiked = comment.likes.includes(currentUserId)

		await Comment.findByIdAndUpdate(
			commentId,
			isLiked
				? { $pull: { likes: currentUserId }, $inc: { likeCount: -1 } }
				: { $push: { likes: currentUserId }, $inc: { likeCount: 1 } }
		)

		return { success: true }
	} catch (error: any) {
		return { success: false, message: error.message }
	}
}

type ReplyToCommentProps = {
	postId: string
	parentCommentId: string
	author: string
	content: string
}

export async function replyToComment({
	postId,
	parentCommentId,
	author,
	content
}: ReplyToCommentProps) {
	try {
		await connectMongoDB()

		const session = await getCurrentUser()

		if (!session) throw new Error('You must be logged in to reply to comments')

		const newComment = await Comment.create({
			postId,
			parentCommentId,
			author,
			content,
			isReply: true
		})

		await newComment.populate('author', 'image username name')

		await Comment.findByIdAndUpdate(parentCommentId, {
			$push: { replies: newComment._id }
		})

		return { success: true, comment: JSON.parse(JSON.stringify(newComment)) }
	} catch (error: any) {
		console.error('`replyToComment`:', error)
		return { success: false, message: error.message }
	}
}

export async function countReplies(parentCommentId: string) {
	await connectMongoDB()

	const replyCount = Comment.countDocuments({ isReply: true, parentCommentId })

	return replyCount ?? 0
}

export async function deleteComment(commentId: string) {
	try {
		await connectMongoDB()

		const comment = await Comment.findById(commentId).select('postId')

		const parentPost = await Post.findById(comment.postId)

		parentPost.commentCount--

		await parentPost.save()

		await Comment.deleteMany({
			$or: [{ _id: commentId }, { parentCommentId: commentId }]
		})

		return { success: true, message: 'Successfully deleted comment' }
	} catch (error: any) {
		console.log('`deleteComment`:', error)
		return { success: false, message: error.message }
	}
}

// ;(async () => {
// 	await Promise.all([
// 		Comment.deleteMany({ isReply: true }),
// 		Comment.updateMany({}, { replies: [] })
// 	])
// 	console.log('deleted')
// })()
