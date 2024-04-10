'use server'

import { Mention } from '@/app/(root)/story/new/mention-input'
import connectMongoDB from '../mongoose'
import { UTApi } from 'uploadthing/server'
import { getCurrentUser } from '../session'
import Post from '../models/post.model'
import { revalidatePath } from 'next/cache'
import User from '../models/user.model'
import { TODO, type Post as PostType } from '../types'
import { SortOrder } from 'mongoose'

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
		const caption = formData.get('caption')
		const content = formData.getAll('content')
		const altText = formData.get('alt') ?? ''

		if (!content) throw new Error('You must provide some content')

		const { user: currentUser } = await getCurrentUser()

		if (!currentUser) throw new Error('You must be logged in to create post')

		const response = await uploadthingApi.uploadFiles(content.slice(0, 10))

		if (response.some(item => item.error))
			throw new Error('Failed to upload some of the images/videos')

		const contentUrls = response.map(item => item.data?.url)

		await connectMongoDB()

		await Post.create({
			author: currentUser._id,
			content: contentUrls,
			caption,
			altText,
			mentions,
			tags
		})

		revalidatePath('/')
		return { success: true, message: 'Successfully created post' }
	} catch (error: any) {
		console.log('Error in `createPost`:', error)
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

		return { success: true, post: JSON.parse(JSON.stringify(post)) }
	} catch (error: any) {
		console.error('`fetchPost`:', error)
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

		return { success: true, posts: JSON.parse(JSON.stringify(posts)) }
	} catch (error: any) {
		console.log('`fetchPosts`:', error)
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

		return { success: true, posts: JSON.parse(JSON.stringify(posts)) }
	} catch (error: any) {
		console.log('Error in `fetchTopPostsByUser`:', error)
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
		console.error('`fetchPopularHashtags`:', error)
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

		// Find the users based on name or username
		const users = await User.find({
			$or: [{ name: { $regex: regex } }, { username: { $regex: regex } }]
		})
			.select('_id')
			.exec()
			.then(users => users.map(user => user._id))

		// Use $or operator to match any of the fields (caption, tags), and author with found user IDs
		const searchResults = await Post.find({
			$or: [
				{ caption: { $regex: regex } },
				{ tags: { $in: [regex] } }, // assuming tags is an array of strings
				{ author: { $in: users } }
			]
		}).populate('author')

		// Return the search results
		return { success: true, posts: JSON.parse(JSON.stringify(searchResults)) }
	} catch (error: any) {
		console.error('`searchPosts`:', error)
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

		const currentUser = await User.findById(currentUserId)
		const isLiked = currentUser.likedPosts.includes(postId)

		await Promise.all([
			User.findByIdAndUpdate(
				currentUserId,
				isLiked
					? { $pull: { likedPosts: postId } }
					: { $push: { likedPosts: postId } }
			),
			Post.findByIdAndUpdate(
				postId,
				isLiked
					? { $pull: { likes: currentUserId }, $inc: { likeCount: -1 } }
					: { $push: { likes: currentUserId }, $inc: { likeCount: 1 } }
			)
		])

		return { success: true }
	} catch (error: any) {
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

		if (post.author.toString() !== currentUserId)
			throw new Error('You are unauthorized to delete this post')

		// content url example: https://utfs.io/f/eeb195b1-95de-4160-8b44-167ca3c3beec-9o58rl.png
		const uploadthingKeys = post.content.map((url: string) =>
			url.substring(url.indexOf('/f/') + 3)
		)

		const responses = await Promise.allSettled([
			uploadthingApi.deleteFiles(uploadthingKeys),
			User.updateMany(
				{ posts: postId, savedPosts: postId, likedPosts: postId },
				{ $pull: { posts: postId, savedPosts: postId, likedPosts: postId } }
			),
			Post.findByIdAndDelete(postId)
		])

		let errorMessage = ''
		responses.forEach(response => {
			if (response.status === 'rejected') errorMessage += `${response.reason}. `
		})

		if (errorMessage.length) throw new Error(errorMessage)

		revalidatePath('/')

		return { success: true, message: 'Successfully deleted post' }
	} catch (error: any) {
		console.log('Error in `deletePost`:', error)
		return { success: false, message: error.message }
	}
}
