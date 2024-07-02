'use server'

import { Mention } from '@/app/(root)/story/new/mention-input'
import { SortOrder } from 'mongoose'
import { revalidatePath } from 'next/cache'
import sharp from 'sharp'
import { UTApi } from 'uploadthing/server'
import auth from '../auth'
import Story from '../models/story.model'
import connectMongoDB from '../mongoose'
import { Story as StoryType, TODO, User as UserType } from '../types'
import { isImage } from '../utils'

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
	mentions: Mention[] | undefined
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
		const content = formData.get('content') as File
		const altText = formData.get('alt')

		if (!content) {
			throw new Error('You must provide some content')
		}

		const { user: currentUser } = await auth()

		if (!currentUser) {
			throw new Error('You must be logged in to create story')
		}

		let response

		if (isImage(content.type)) {
			const contentBuffer = await content.arrayBuffer()

			const resizedBuffer = await sharp(Buffer.from(contentBuffer))
				.resize(420, 740, { fit: 'cover', position: 'center' })
				.toBuffer()

			const resizedContent = new File([resizedBuffer], content.name, {
				type: content.type
			})

			response = await uploadthingApi.uploadFiles(resizedContent)
		} else {
			response = await uploadthingApi.uploadFiles(content)
		}

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

type FetchStory =
	| { success: true; story: StoryType }
	| { success: false; message: string }

type FetchStoryOptions = {
	select?: string
	populate?: [string, string]
}

export async function fetchStory(
	conditions: Record<string, string>,
	{ select, populate }: FetchStoryOptions = {}
): Promise<FetchStory> {
	try {
		await connectMongoDB()

		let query = Story.findOne(conditions, select)

		if (populate?.length) {
			query = query.populate(populate[0], populate[1])
		}

		const story = await query.exec()

		if (!story) throw new Error('Failed to fetch story')

		return { success: true, story: JSON.parse(JSON.stringify(story)) }
	} catch (error: any) {
		console.error('`fetchStory`:', error)
		return { success: false, message: error.message }
	}
}

type FetchStories =
	| { success: true; stories: StoryType[] }
	| { success: false; message: string }

type FetchStoriesOptions = FetchStoryOptions & {
	sort?: Record<string, SortOrder>
	limit?: number
}

export async function fetchStories(
	conditions?: Record<any, any>,
	{ select, populate, sort, limit }: FetchStoriesOptions = {}
): Promise<FetchStories> {
	try {
		await connectMongoDB()

		let query = Story.find(conditions as TODO, select)

		if (populate?.length) query.populate(populate[0], populate[1])

		if (sort) query.sort(sort)

		if (typeof limit === 'number') query.limit(limit)

		const stories = await query.exec()

		if (!stories) throw new Error('Failed to fetch stories')

		return { success: true, stories: JSON.parse(JSON.stringify(stories)) }
	} catch (error: any) {
		console.log('`fetchStories`:', error)
		return { success: false, message: error.message }
	}
}

export type StoryForToday = {
	author: UserType
	seen: boolean
}

type FetchStoriesForToday =
	| { success: true; stories: StoryForToday[] }
	| { success: false; message: string }

export async function fetchStoriesForToday(): Promise<FetchStoriesForToday> {
	try {
		await connectMongoDB()

		const { user: currentUser } = await auth()

		if (!currentUser) throw new Error('User not found')

		if (!currentUser.following.length) return { success: true, stories: [] }

		const storiesForToday = await Story.find<StoryType>({
			author: { $in: currentUser.following },
			...isPostedWithinLast24h
		})
			.sort({ createdAt: -1 })
			.populate('author', 'image username')
			.select('author views')
			.exec()

		const stories = storiesForToday
			.map(story => ({
				author: story.author as UserType,
				seen: (story.views as string[]).includes(currentUser._id)
			}))
			.toSorted(story => (story.seen ? 1 : -1))

		const grouped = stories.filter(
			(story, index, self) =>
				index === self.findIndex(t => t.author._id === story.author._id)
		)

		return {
			success: true,
			stories: JSON.parse(JSON.stringify(grouped))
		}
	} catch (error: any) {
		console.log('Error in `fetchStoriesForToday`:', error)
		return { success: false, message: error.message }
	}
}

export async function doesCurrentUserHaveActiveStories() {
	try {
		await connectMongoDB()

		const { user: currentUser } = await auth()

		const stories = await Story.find({
			author: currentUser._id,
			...isPostedWithinLast24h
		}).select('views')

		const hasUnseenStories = stories.some(story =>
			story.views.includes(currentUser._id)
		)

		return {
			success: true,
			hasActiveStories: !!stories.length,
			hasUnseenStories
		}
	} catch (error: any) {
		console.log('`doesCurrentUserHaveActiveStories`:', error)
		return { success: false, message: error.message }
	}
}

export async function viewStory(storyId: string) {
	if (!storyId) return

	try {
		await connectMongoDB()

		const { user: currentUser } = await auth()

		const story = await Story.findById(storyId).select('views')

		if (story.views.includes(currentUser._id)) return

		story.views.push(currentUser._id)

		await story.save()
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
			Story.findByIdAndDelete(storyId)
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
