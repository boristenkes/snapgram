'use server'

import connectMongoDB from '../mongoose'
import { Story as StoryType } from '../types'
import { UTApi } from 'uploadthing/server'
import { Mention } from '@/app/(root)/story/new/mention-input'
import { getCurrentUser } from '../session'
import User from '../models/user.model'
import Story from '../models/story.model'
import { revalidatePath } from 'next/cache'
import { removeDuplicates } from '../utils'

const uploadthingApi = new UTApi()
const isPostedWithinLast24h = {
	createdAt: {
		$gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
	}
}
let isCleanedUp = false

async function cleanUp() {
	if (isCleanedUp) return

	const stories = await Story.find()
	await Promise.all(stories.map(story => deleteStory(story._id.toString())))
	isCleanedUp = true
	console.log('cleaned 👍')
}
// cleanUp()

type CreateStoryProps = {
	formData: FormData
	mentions: Mention[]
	tags: string[]
}

export async function createStory({
	formData,
	mentions,
	tags
}: CreateStoryProps): Promise<{
	success: boolean
	message: string
}> {
	try {
		const content = formData.get('content')
		const altText = formData.get('alt')

		if (!content) {
			throw new Error('You must provide some content')
		}

		const { user: currentUser } = await getCurrentUser()

		if (!currentUser) {
			throw new Error('You must be logged in to create story')
		}

		const response = await uploadthingApi.uploadFiles(content)

		if (response.error) {
			throw new Error(`Failed to upload content: ${response.error.message}`)
		}

		const contentUrl = response.data.url

		await connectMongoDB()

		const newStory = await Story.create({
			author: currentUser._id,
			content: contentUrl,
			alt: altText ?? '',
			mentions,
			tags
		})

		await uploadthingApi.renameFiles({
			fileKey: response.data.key,
			newName: `story_${newStory._id}`
		})

		revalidatePath('/')
		return { success: true, message: 'Story created successfully' }
	} catch (error: any) {
		return { success: false, message: error.message }
	}
}

export async function fetchStory(storyId: string) {
	try {
		if (!storyId) throw new Error('Story ID not provided')

		await connectMongoDB()

		const story = await Story.findById(storyId)

		if (!story) throw new Error('Story not found')

		return { success: true, story }
	} catch (error: any) {
		return { success: false, message: error.message }
	}
}

type FetchStoriesForToday =
	| { success: true; stories: StoryType[] }
	| { success: false; message: string }

export async function fetchStoriesForToday(
	currentUserId: string
): Promise<FetchStoriesForToday> {
	try {
		await connectMongoDB()

		const currentUser = await User.findById(currentUserId).select(
			'following seenStories'
		)

		if (!currentUser) throw new Error('User not found')

		if (!currentUser.following.length) return { success: true, stories: [] }

		const stories = await Story.find<StoryType>({
			author: { $in: currentUser.following },
			...isPostedWithinLast24h
		})
			.sort({ createdAt: -1 })
			.populate('author', 'image username')
			.select('author')
			.exec()

		// Sorting stories to not-seen stories appear first
		stories.sort(story =>
			currentUser.seenStories.includes(story._id) ? 1 : -1
		)

		const grouped = removeDuplicates(stories, 'author')

		return { success: true, stories: grouped }
	} catch (error: any) {
		console.log('Error in `fetchStoriesForToday`:', error)
		return { success: false, message: error.message }
	}
}

type FetchActiveStories =
	| { success: true; activeStories: StoryType[] }
	| { success: false; message: string }

export async function fetchActiveStories(
	userId: string
): Promise<FetchActiveStories> {
	try {
		await connectMongoDB()

		const activeStories = await Story.find({
			author: userId,
			...isPostedWithinLast24h
		})

		return { success: true, activeStories }
	} catch (error: any) {
		console.log('Error in `fetchActiveStories`:', error)
		return { success: false, message: error.message }
	}
}

type FetchAllStoriesProps = {
	select?: string
}

export async function fetchAllStories({ select = '' }: FetchAllStoriesProps) {
	try {
		await connectMongoDB()

		const stories = await Story.find().select(select)

		if (!stories) throw new Error('Failed to fetch stories')

		return { success: true, stories }
	} catch (error: any) {
		console.log('Error in `fetchAllStories`:', error)
		return { success: false, message: error.message }
	}
}

export async function fetchUserStories(userId: string) {
	try {
		await connectMongoDB()

		const stories = await Story.find<StoryType>({ author: userId })

		return { success: true, stories }
	} catch (error: any) {
		console.log('Error in `fetchUserStories`:', error)
		return { success: false, message: error.message }
	}
}

type ViewStoryProps = {
	storyId: string
	currentUserId: string
}

export async function viewStory({ storyId, currentUserId }: ViewStoryProps) {
	if (!storyId || !currentUserId) return

	try {
		await connectMongoDB()

		const currentUser = await User.findById(currentUserId).select('seenStories')

		if (currentUser.seenStories.includes(storyId)) return

		await Promise.all([
			User.findByIdAndUpdate(currentUserId, {
				$push: { seenStories: storyId }
			}),
			Story.findByIdAndUpdate(storyId, {
				$push: { views: currentUserId }
			})
		])
	} catch (error) {
		console.log('Error in `viewStory`:', error)
	}
}

type DeleteStory = {
	success: boolean
	message: string
}

export async function deleteStory(storyId: string): Promise<DeleteStory> {
	try {
		if (!storyId || typeof storyId !== 'string')
			throw new Error('Story ID not provided')

		await connectMongoDB()

		const story = await Story.findById(storyId).select('content')

		if (!story) throw new Error('Story not found')

		// `story.content` example: https://utfs.io/f/eeb195b1-95de-4160-8b44-167ca3c3beec-9o58rl.png
		const uploadthingKey = story.content.substring(
			story.content.indexOf('/f/') + 3
		)

		await Promise.all([
			uploadthingApi.deleteFiles(uploadthingKey),
			Story.findByIdAndDelete(storyId),
			User.updateMany(
				{ seenStories: storyId },
				{ $pull: { seenStories: storyId } }
			)
		])

		return { success: true, message: 'Successfully deleted story' }
	} catch (error: any) {
		console.log('Error in `deleteStory`:', error)
		return {
			success: false,
			message: 'Failed to delete story:' + error.message
		}
	}
}
