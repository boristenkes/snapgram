'use server'

import { Mention } from '@/app/(root)/story/new/mention-input'
import auth from '@/lib/auth'
import Comment from '@/lib/models/comment.model'
import Post from '@/lib/models/post.model'
import User from '@/lib/models/user.model'
import { SortOrder } from 'mongoose'
import { revalidatePath } from 'next/cache'
import sharp from 'sharp'
import { UTApi } from 'uploadthing/server'
import Notification from '../models/notification.model'
import connectMongoDB from '../mongoose'
import {
	Notification as NotificationType,
	TODO,
	type Post as PostType
} from '../types'
import { isImage, serialize } from '../utils'
import { deleteNotification, sendNotification } from './notification.actions'

const uploadthingApi = new UTApi()

type CreatePostProps = {
	formData: FormData
	mentions: Mention[]
	tags: string[]
}

type CreatePost = {
	success: boolean
	message: string
}

export async function createPost({
	formData,
	mentions,
	tags
}: CreatePostProps): Promise<CreatePost> {
	try {
		const caption = (formData.get('caption') as string) ?? ''
		const content = formData.getAll('content').slice(0, 10) as File[]
		const altText = formData.get('alt') ?? ''

		if (!content) throw new Error('You must provide some content')

		const { user: currentUser } = await auth()

		if (!currentUser) throw new Error('You must be logged in to create post')

		const resizedFiles = await Promise.all(
			content.map(async file => {
				if (!isImage(file.name)) return file

				const buffer = await file.arrayBuffer()

				const resizedBuffer = await sharp(Buffer.from(buffer))
					.resize(542, 520, { fit: 'cover', position: 'center' })
					.toBuffer()

				return new File([resizedBuffer], file.name, {
					type: file.type
				})
			})
		)

		const response = await uploadthingApi.uploadFiles(resizedFiles)

		// const response = await uploadthingApi.uploadFiles(content)

		if (response.some(item => item.error))
			throw new Error('Failed to upload some of the images/videos')

		const contentUrls = response.map(item => item.data?.url)

		await connectMongoDB()

		const [newPost] = await Promise.all([
			Post.create({
				author: currentUser._id,
				content: contentUrls,
				caption: caption.trim(),
				altText,
				mentions,
				tags
			}),
			User.findByIdAndUpdate(currentUser._id, { $inc: { postsCount: 1 } })
		])

		await uploadthingApi.renameFiles(
			response.map(file => ({
				fileKey: file.data?.key as string,
				newName: `post_${newPost._id.toString()}`
			}))
		)

		const notifyMentionedUsers = mentions.map(mention =>
			sendNotification({
				recipient: mention._id,
				sender: currentUser._id,
				type: 'POST_MENTION',
				// @ts-ignore TODO
				postId: newPost._id
			})
		)

		await Promise.all(notifyMentionedUsers)

		revalidatePath('/')
		return { success: true, message: 'Successfully created post' }
	} catch (error: any) {
		console.error('[CREATE_POST]:', error)
		return { success: false, message: error.message }
	}
}

type UpdatePostProps = {
	authorId: string
	postId: string
	caption: string
	altText: string
	mentions: Mention[]
	tags: string[]
}

export async function updatePost({
	authorId,
	postId,
	caption,
	altText,
	mentions,
	tags
}: UpdatePostProps) {
	try {
		await connectMongoDB()

		const { user: currentUser } = await auth()

		if (!currentUser) throw new Error('You must be logged in to edit this post')

		if (currentUser._id !== authorId)
			throw new Error('You are not authorized to edit this post')

		await Post.findByIdAndUpdate(postId, {
			caption,
			altText,
			mentions,
			tags
		})

		return { success: true, message: 'Successfully edited post' }
	} catch (error: any) {
		console.error('[UPDATE_POST]:', error)
		return { success: false, message: error.message }
	}
}

type FetchPost =
	| { success: true; post: PostType }
	| { success: false; message: string }

type FetchPostOptions = {
	select?: string
	populate?: [string, string]
}

export async function fetchPost(
	conditions: Record<string, string>,
	{ select, populate }: FetchPostOptions = {}
): Promise<FetchPost> {
	try {
		await connectMongoDB()

		let query = Post.findOne(conditions, select)

		if (populate?.length) {
			query = query.populate(populate[0], populate[1])
		}

		const post = await query.exec()

		if (!post) throw new Error('Failed to fetch post')

		return { success: true, post: serialize(post) }
	} catch (error: any) {
		console.error('[FETCH_POST]:', error)
		return { success: false, message: error.message }
	}
}

type FetchPosts =
	| { success: true; posts: PostType[] }
	| { success: false; message: string }

type FetchPostsOptions = FetchPostOptions & {
	sort?: Record<string, SortOrder>
	limit?: number
}

export async function fetchPosts(
	conditions?: Record<any, any>,
	{ select, populate, sort, limit }: FetchPostsOptions = {}
): Promise<FetchPosts> {
	try {
		await connectMongoDB()

		let query = Post.find(conditions as TODO, select)

		if (populate?.length) query.populate(populate[0], populate[1])

		if (sort) query.sort(sort)

		if (typeof limit === 'number') query.limit(limit)

		const posts = await query.exec()

		if (!posts) throw new Error('Failed to fetch posts')

		return { success: true, posts: serialize(posts) }
	} catch (error: any) {
		console.error('[FETCH_POSTS]:', error)
		return { success: false, message: error.message }
	}
}

type FetchTopPostsByUser =
	| { success: true; posts: PostType[] }
	| { success: false; message: string }

export async function fetchTopPostsByUser(
	userId: string
): Promise<FetchTopPostsByUser> {
	try {
		if (!userId) throw new Error('User ID not provided')

		await connectMongoDB()

		const posts = await Post.find({
			author: userId
		})
			.sort({ likeCount: 'desc', shareCount: 'desc', commentCount: 'desc' })
			.limit(3)
			.exec()

		if (!posts) throw new Error('Failed to fetch posts')

		return { success: true, posts: serialize(posts) }
	} catch (error: any) {
		console.error('[FETCH_TOP_POSTS_BY_USER]:', error)
		return { success: false, message: error.message }
	}
}

export type FetchPopularHashtags =
	| { success: true; hashtags: string[] }
	| { success: false; message: string }

export async function fetchPopularHashtags(): Promise<FetchPopularHashtags> {
	try {
		const popularHashtags = await Post.aggregate([
			{ $unwind: '$tags' }, // Split tags array into separate documents
			{ $group: { _id: '$tags', count: { $sum: 1 } } }, // Group by tag and count occurrences
			{ $sort: { count: -1 } }, // Sort by count in descending order
			{ $limit: 4 } // Limit to the top 4 hashtags
		])

		const hashtags = popularHashtags.map(hashtag => hashtag._id)

		return { success: true, hashtags }
	} catch (error: any) {
		console.error('[FETCH_POPULAR_HASHTAGS]:', error)
		return { success: false, message: error.message }
	}
}

export type SearchPosts =
	| { success: true; posts: PostType[] }
	| { success: false; message: string }

export async function searchPosts(searchTerm: string): Promise<SearchPosts> {
	try {
		await connectMongoDB()

		const regex = new RegExp(searchTerm, 'i')
		const { user: currentUser } = await auth()

		const searchResults = await Post.find({
			$and: [
				{
					$or: [
						{ caption: { $regex: regex } },
						{ tags: { $regex: regex } },
						// Include the condition to check author by their name or username
						{
							author: await User.find({
								$or: [
									{ name: { $regex: regex } },
									{ username: { $regex: regex } }
								]
							}).select('_id')
						}
					]
				},
				{
					$or: [
						{ author: currentUser._id },
						{ author: { $in: currentUser.following } }, // authors followed by the current user
						{
							author: { $in: await User.find({ private: false }).select('_id') }
						} // public authors
					]
				}
			]
		}).populate('author')

		return { success: true, posts: serialize(searchResults) }
	} catch (error: any) {
		console.error('[SEARCH_POSTS]:', error)
		return { success: false, message: error.message }
	}
}

type ActionPostProps = {
	currentUserId: string
	postId: string
}

export async function togglePostLike({
	currentUserId,
	postId
}: ActionPostProps) {
	try {
		await connectMongoDB()

		const [currentUser, post] = await Promise.all([
			User.findById(currentUserId),
			Post.findById(postId).select('author caption')
		])

		const isLiked = currentUser.likedPosts.includes(postId)

		const updateUserLikedPosts = User.findByIdAndUpdate(
			currentUserId,
			isLiked
				? { $pull: { likedPosts: postId } }
				: { $push: { likedPosts: postId } }
		)

		const updatePostLikes = Post.findByIdAndUpdate(
			postId,
			isLiked
				? { $pull: { likes: currentUserId }, $inc: { likeCount: -1 } }
				: { $push: { likes: currentUserId }, $inc: { likeCount: 1 } }
		)

		await Promise.all([updateUserLikedPosts, updatePostLikes])

		const notificationData = {
			type: 'LIKED_POST',
			sender: currentUserId,
			recipient: post.author,
			postId: post._id
		} as NotificationType

		if (!isLiked) {
			await sendNotification(notificationData)
		} else {
			await deleteNotification(notificationData)
		}

		return { success: true }
	} catch (error: any) {
		console.error('[TOGGLE_POST_LIKE]:', error)
		return { success: false, message: error.message }
	}
}

export async function togglePostSave({
	currentUserId,
	postId
}: ActionPostProps) {
	try {
		await connectMongoDB()

		const currentUser = await User.findById(currentUserId)
		const isSaved = currentUser.savedPosts.includes(postId)

		await User.findByIdAndUpdate(
			currentUserId,
			isSaved
				? { $pull: { savedPosts: postId } }
				: { $push: { savedPosts: postId } }
		)

		return { success: true }
	} catch (error: any) {
		console.error('[TOGGLE_POST_SAVE]:', error)
		return { success: false, message: error.message }
	}
}

type DeletePost = { success: boolean; message: string }

export async function deletePost(
	currentUserId: string,
	postId: string
): Promise<DeletePost> {
	try {
		if (!currentUserId || !postId)
			throw new Error('You are unauthorized to delete this post')

		await connectMongoDB()

		const post = await Post.findById(postId).select('author content')

		if (!post) throw new Error("Couldn't find post. Please try again later")

		if (post.author.toString() !== currentUserId.toString())
			throw new Error('You are unauthorized to delete this post')

		// content url example: https://utfs.io/f/eeb195b1-95de-4160-8b44-167ca3c3beec-9o58rl.png
		const uploadthingKeys = post.content.map((url: string) =>
			url.substring(url.indexOf('/f/') + 3)
		)

		const deleteImages = uploadthingApi.deleteFiles(uploadthingKeys)
		const updateUserPostRelations = User.updateMany(
			{ posts: postId, savedPosts: postId, likedPosts: postId },
			{ $pull: { posts: postId, savedPosts: postId, likedPosts: postId } }
		)
		const decreaseCurrentUserPostCount = User.findByIdAndUpdate(currentUserId, {
			$inc: { postsCount: -1 }
		})
		const deletePost = Post.findByIdAndDelete(postId)
		const deleteComments = Comment.deleteMany({ postId })
		const deleteNotifications = Notification.deleteMany({ postId })

		const responses = await Promise.allSettled([
			deleteImages,
			updateUserPostRelations,
			decreaseCurrentUserPostCount,
			deletePost,
			deleteComments,
			deleteNotifications
		])

		let errorMessage = ''
		responses.forEach(response => {
			if (response.status === 'rejected') errorMessage += `${response.reason}. `
		})

		if (errorMessage.length) throw new Error(errorMessage)

		revalidatePath('/')

		return { success: true, message: 'Successfully deleted post' }
	} catch (error: any) {
		console.error('[DELETE_POST]:', error)
		return { success: false, message: error.message }
	}
}
