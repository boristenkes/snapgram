import { z } from 'zod'

const MAX_CONTENT_SIZE = {
	image: Math.pow(1024, 4) * 4, // 4MB
	video: Math.pow(1024, 8) * 8 // 8MB
}

export const newStorySchema = z.object({})
