import { z } from 'zod'

export const createUserSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.trim()
		.min(8, 'Password must be at least 8 characters long')
		.max(25, 'Password must be at most 25 characters long')
})

export type CreateUserFields = z.infer<typeof createUserSchema>

export const registerUserSchema = z
	.object({
		email: z.string().min(1, 'Email is required').email(),
		password: z
			.string()
			.trim()
			.min(8, 'Password must be at least 8 characters')
			.max(25, 'Password must be less than 25 characters'),
		confirmPassword: z.string().min(1, 'Confirm Password is required')
	})
	.refine(data => data.confirmPassword === data.password, {
		message: 'Password did not match',
		path: ['confirmPassword']
	})

export type RegisterUserFields = z.infer<typeof registerUserSchema>

export const onboardingSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Name must be at least 2 characters')
		.max(20, 'Name must be less than 20 characters'),
	username: z
		.string()
		.trim()
		.min(2, 'Username must be at least 2 characters')
		.max(20, 'Username must be less than 20 characters')
		.toLowerCase()
		.regex(
			/^[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]*[a-zA-Z0-9]$/,
			'Invalid username. Use only letters, numbers, periods, and underscores.'
		),
	bio: z
		.string()
		.trim()
		.max(200, 'Bio must be less than 200 characters')
		.optional()
})

export type OnboardingFields = z.infer<typeof onboardingSchema>

export const loginUserSchema = z.object({
	email: z.string().min(1, 'Email is required').email(),
	password: z.string().trim().min(1, 'Password is required')
})

export type LoginFields = z.infer<typeof loginUserSchema>

export const editProfileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Name must be at least 2 characters')
		.max(20, 'Name must be less than 20 characters'),
	username: z
		.string()
		.trim()
		.min(2, 'Username must be at least 2 characters')
		.max(20, 'Username must be less than 20 characters')
		.toLowerCase()
		.regex(
			/^[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]*[a-zA-Z0-9]$/,
			'Invalid username. Use only letters, numbers, periods, and underscores'
		),
	email: z.string().email(),
	bio: z
		.string()
		.max(200, 'Bio must be less than 200 characters long')
		.optional()
})

export type EditProfileFields = z.infer<typeof editProfileSchema>
