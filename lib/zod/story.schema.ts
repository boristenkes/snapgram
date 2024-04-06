import { z } from 'zod'
import { removeDuplicates } from '../utils'

const mentionSchema = z.string().trim().toLowerCase()

const tagSchema = z
	.string()
	.trim()
	.toLowerCase()
	.max(20, 'Every tag must be shorter than 20 characters')
	.regex(
		/^[a-zA-Z0-9_-]+$/,
		'Tags can contain only letters, numbers, underscores, or hyphens.'
	)

export const newStorySchema = z.object({
	content: z
		.instanceof(File)
		.refine(file => file.size <= 1024 * 1024 * 2, 'File too large. Max 2MB')
		.refine(
			file => file.type.startsWith('image/') || file.type.startsWith('video/'),
			'Invalid file type. Must be either image or video file'
		),
	mentions: z
		.array(mentionSchema)
		.optional()
		.transform(tags =>
			removeDuplicates(tags?.map(tag => tag.trim().toLowerCase()) as string[])
		),
	tags: z
		.array(tagSchema)
		.max(30, 'You can only specify 30 tags')
		.optional()
		.transform(tags =>
			removeDuplicates(tags?.map(tag => tag.trim().toLowerCase()) as string[])
		),
	altText: z
		.string()
		.max(30, 'Alt test must be less than 30 characters')
		.optional()
})

export type NewStoryFields = z.infer<typeof newStorySchema>
