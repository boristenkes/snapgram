import { z } from 'zod'

const mentionSchema = z.string().trim().toLowerCase()

export const editPostSchema = z.object({
	caption: z.string().optional(),
	mentions: z.array(mentionSchema).optional()
})

export type EditPostFields = z.infer<typeof editPostSchema>
