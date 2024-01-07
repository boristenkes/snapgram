'use server'

import connectMongoDB from '../mongoose'
import { UserProfile } from '../types'

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
