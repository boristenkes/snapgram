'use server'

import { Mention } from '@/app/(root)/story/new/mention-input'
import connectMongoDB from '../mongoose'
import { UTApi } from 'uploadthing/server'
import { getCurrentUser } from '../session'
import Post from '../models/post.model'
import { revalidatePath } from 'next/cache'
import User from '../models/user.model'

let isCleanedUp = false

const cleanUp = async () => {
	if (isCleanedUp) return

	const posts = await Post.find()
	await Promise.all(posts.map(post => deletePost(post._id.toString())))
	isCleanedUp = true
	console.log('cleaned 👍')
}
// cleanUp()

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

		const newPost = await Post.create({
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

type FetchAllStoriesProps = {
	select: string
}

export async function fetchAllPosts({ select = '' }: FetchAllStoriesProps) {
	try {
		await connectMongoDB()

		const posts = await Post.find().select(select)

		if (!posts) throw new Error('Failed to fetch all stories')

		return { success: true, posts }
	} catch (error: any) {
		console.log('Error in `fetchAllPosts`:', error)
		return { success: false, message: error.message }
	}
}

type FetchPostsForUserOptions = {
	select?: string
	populateAuthor?: boolean
}

export async function fetchPostsForUser(
	following?: string[],
	{ select = '', populateAuthor = false }: FetchPostsForUserOptions = {}
) {
	try {
		if (!following) throw new Error('`following` not provided')

		const { user: currentUser } = await getCurrentUser()

		await connectMongoDB()

		let query = Post.find({
			$or: [{ author: { $in: following } }, { author: currentUser._id }]
		})
			.select(select)
			.sort({ createdAt: -1 })

		if (populateAuthor) query = query.populate('author', 'image name username')

		const posts = await query

		if (!posts) throw new Error('Failed to fetch posts. Please try again later')

		return { success: true, posts }
	} catch (error: any) {
		console.log('Error in `fetchPostsForUser`:', error)
		return { success: false, message: error.message }
	}
}

export async function fetchTopPostsByUser(userId: string) {
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

		return { success: true, posts }
	} catch (error: any) {
		console.log('Error in `fetchTopPostsByUser`:', error)
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

export async function deletePost(postId: string) {
	try {
		await connectMongoDB()

		const post = await Post.findById(postId)

		if (!post) throw new Error("Couldn't find post. Please try again later")

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

		return { success: true, message: 'Successfully deleted post' }
	} catch (error: any) {
		console.log('Error in `deletePost`:', error)
		return { success: false, message: error.message }
	}
}
