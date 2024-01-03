'use server'

import connectMongoDB from '../mongoose'
import User from '../models/user.model'
import { RegisterValidation } from '../validations/user'

const bcrypt = require('bcrypt')

export async function registerUser(userData: unknown) {
	// server-side validation
	const validationResult = RegisterValidation.safeParse(userData)

	if (!validationResult.success) {
		let errorMessage = ''

		const errors = validationResult.error.issues
		errors.forEach(error => {
			errorMessage += `${error.message}. `
		})

		return { error: errorMessage }
	}

	try {
		connectMongoDB()

		const { username, email, password } = validationResult.data

		// making sure user doesn't already exist
		const existingUser = await User.exists({
			$or: [{ email }, { username }]
		})

		if (existingUser) {
			console.error('User already exists')
			return {
				error: 'User with this email or username already exists.'
			}
		}

		// registering new user
		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await User.create({
			email,
			username,
			password: hashedPassword
		})

		const { newUserEmail, newUserPassword } = newUser._doc

		return { email: newUserEmail, password: newUserPassword }
	} catch (error: any) {
		console.error('Error registering user', error)
		return { error: error.message }
	}
}

type AuthenticateProps = {
	email: string
	password: string
}

export async function authenticate({ email, password }: AuthenticateProps) {
	try {
		connectMongoDB()

		const user = await User.findOne({ email })

		if (!user) {
			throw new Error('User with given email was not found.')
		}

		const passwordMatch = await bcrypt.compare(password, user.password)

		if (passwordMatch) return user

		throw new Error('Invalid password.')
	} catch (error) {
		console.error(error)
		throw new Error('Failed to authenticate user.')
	}
}

export async function getAllUsers() {
	connectMongoDB()
}
