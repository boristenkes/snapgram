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

		await Post.findByIdAndUpdate(newComment.postId, {
			$inc: { commentCount: 1 }
		})

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
	populate?: [string, string]
}

export async function fetchComment(
	conditions: Record<string, string>,
	{ select, populate }: FetchCommentOptions = {}
): Promise<FetchComment> {
	try {
		await connectMongoDB()

		let query = Comment.findOne(conditions, select)

		if (populate?.length) {
			query = query.populate(populate[0], populate[1])
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

		if (populate?.length) query.populate(populate[0], populate[1])

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
