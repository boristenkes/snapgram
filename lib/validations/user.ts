import { z } from 'zod'

export const createUserSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.trim()
		.min(8, 'Password must be at least 8 characters long')
		.max(25, 'Password must be at most 25 characters long')
})

export const registerUserSchema = z
	.object({
		email: z.string().min(1, 'Email is required').email(),
		password: z
			.string()
			.trim()
			.min(8, 'Password must be at least 8 characters long')
			.max(25, 'Password must be at most 25 characters long'),
		confirmPassword: z.string().min(1, 'Confirm Password is required')
	})
	.refine(data => data.confirmPassword === data.password, {
		message: 'Password did not match',
		path: ['confirmPassword']
	})

export const onboardingSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Name must be at least 2 characters long')
		.max(20, 'Name must be at most 20 characters long'),
	username: z
		.string()
		.trim()
		.min(2, 'Username must be at least 2 characters long')
		.max(20, 'Username must be at most 20 characters long')
		.toLowerCase()
		.regex(
			/^[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]*[a-zA-Z0-9]$/,
			'Invalid username. Use only letters, numbers, periods, and underscores.'
		),
	bio: z
		.string()
		.trim()
		.max(200, 'Bio must be at most 200 characters')
		.optional()
})

export const loginUserSchema = z.object({
	email: z.string().min(1, 'Email is required').email(),
	password: z.string().trim().min(1, 'Password is required')
})

export const editProfileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Name must be at least 2 characters long')
		.max(20, 'Name must be at most 20 characters long'),
	username: z
		.string()
		.trim()
		.min(2, 'Username must be at least 2 characters long')
		.max(20, 'Username must be at most 20 characters long')
		.toLowerCase()
		.regex(
			/^[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]*[a-zA-Z0-9]$/,
			'Invalid username. Use only letters, numbers, periods, and underscores'
		),
	email: z.string().email(),
	bio: z.string().max(200, 'Bio must be at most 200 characters long').optional()
})
