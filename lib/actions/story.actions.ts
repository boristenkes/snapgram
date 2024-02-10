'use server'

import connectMongoDB from '../mongoose'
import { UserProfile } from '../types'
import { UTApi } from 'uploadthing/server'
import { delay } from '../utils'

const uploadthingApi = new UTApi()

type CreateStoryProps = {
	formData: FormData
}

export async function createStory({ formData }: CreateStoryProps) {
	await delay(1000)

	console.log(formData.getAll('content'))
}

type GetMyStoriesProps = {
	following: UserProfile[]
}

export async function getMyStories({ following }: GetMyStoriesProps) {
	try {
		connectMongoDB()
	} catch (error: any) {
		console.error('Error in `getMyStories`:', error)
		return { error: error.message }
	}
}
