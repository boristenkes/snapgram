import { z } from 'zod'

export const RegisterValidation = z
	.object({
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
		name: z
			.string()
			.trim()
			.min(2, 'Name must be at least 2 characters long')
			.max(20, 'Name must be at most 20 characters long'),
		email: z.string().email(),
		password: z
			.string()
			.trim()
			.min(8, 'Password must be at least 8 characters long')
			.max(25, 'Password must be at most 25 characters long'),
		confirmPassword: z.string()
		// .refine(data => data === data.password, 'Password did not match')
	})
	.refine(
		data => data.password === data.confirmPassword,
		'Passwords did not match'
	)

export const LoginValidation = z.object({
	email: z.string().email(),
	password: z.string().trim().min(1, 'Password is required')
})

export const EditProfileValidation = z.object({
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
