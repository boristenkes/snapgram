'use server'

import connectMongoDB from '../mongoose'
import User from '../models/user.model'
import { createUserSchema, editProfileSchema } from '../validations/user'
import { UTApi } from 'uploadthing/server'
import { validateImage } from '../utils'
import { revalidatePath } from 'next/cache'

const uploadthingApi = new UTApi()

const bcrypt = require('bcrypt')

export async function createUser({ email, password }: Record<string, unknown>) {
	const validationResult = createUserSchema.safeParse({ email, password })

	if (!validationResult.success) {
		let errorMessage = ''

		const errors = validationResult.error.issues
		errors.forEach(error => {
			errorMessage += `${error.message}. `
		})

		return { error: errorMessage }
	}

	try {
		await connectMongoDB()

		const existingUser = await User.exists({ email })

		if (existingUser)
			return {
				error: 'User with this email already exists.'
			}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await User.create({ email, password: hashedPassword })

		return { email: newUser.email, password: newUser.password }
	} catch (error: any) {
		console.error('Error creating new user:', error)
		return { error: error.message }
	}
}

export async function onboard(
	userId: string,
	data: {
		name: string
		username: string
		bio?: string
	}
) {
	try {
		await connectMongoDB()

		const existingUser = await User.exists({ username: data.username })

		if (existingUser) {
			return {
				error:
					'User with this username already exists, please choose another one.'
			}
		}

		await User.findByIdAndUpdate(userId, {
			...data,
			onboarded: true
		})
	} catch (error: any) {
		console.error('Failed to onboard user:', error)
		return { error: error.message }
	}
}

export async function getUser({ username }: { username: string }) {
	try {
		await connectMongoDB()

		const user = await User.findOne({ username }).select(
			'image name username postsCount followersCount followingCount bio posts private verified'
		)

		return user
	} catch (error: any) {
		console.error('User not found in `getUser()`:', error)
		return { error: 'User not found' }
	}
}

type GetAllUsersProps = {
	select?: string | string[]
}

export async function getAllUsers({ select = '' }: GetAllUsersProps = {}) {
	await connectMongoDB()

	const users = await User.find().select(select)

	return users
}

type FormObj = Record<string, FormDataEntryValue | string>

type UpdateUserProps = {
	_id: string
	formData: FormData
	username: string
	name: string
	email: string
	bio?: string
}

export async function updateUser({
	_id,
	formData,
	username,
	name,
	email,
	bio
}: UpdateUserProps) {
	const formObj: FormObj = {
		username,
		name,
		email
	}

	// bio is only one optional so we need to check if it's even provided
	if (bio) Object.assign(formObj, { bio })

	// Server-side form validation
	const validationResult = editProfileSchema.safeParse(formObj)

	if (!validationResult.success) {
		return { error: 'Invalid data' }
	}

	try {
		await connectMongoDB()
		const image = formData.get('image') as File

		// const image = formData.get('image') as File
		const isImageProvided = image?.name !== 'undefined' && image?.size

		let imageResponse

		if (isImageProvided) {
			const imageValidation = validateImage(image as File)

			if (!imageValidation.success) {
				return { error: 'Invalid image' }
			}

			imageResponse = await uploadthingApi.uploadFiles(image)

			if (imageResponse?.error) {
				return {
					error: 'Image failed to upload:' + imageResponse.error.message
				}
			}

			const isRenamed = await uploadthingApi.renameFile({
				fileKey: imageResponse?.data?.key,
				newName: `avatar_${username}`
			})
			if (!isRenamed)
				console.error('user.actions.ts/updateUser: Failed to rename image')
		}

		// If image is successfully uploaded, we're adding it to formObj
		if (imageResponse?.data?.url) {
			formObj.image = imageResponse?.data.url
		}

		const userBeforeUpdate = await User.findOneAndUpdate(
			{ _id },
			formObj
		).select('image')

		// Deleting old image from uploadthing,
		// if new image is provided AND if new image is successfully uploaded
		if (isImageProvided && !imageResponse?.error) {
			const oldImageUrl = userBeforeUpdate?.image

			// oldImageUrl example: https://utfs.io/f/eeb195b1-95de-4160-8b44-167ca3c3beec-9o58rl.png
			const isPictureFromUploadthing = oldImageUrl?.includes('utfs.io/f/')

			// Users signed in with Google get their image from there,
			// so we're making sure old image is from uploadthing before attempting to delete it
			if (isPictureFromUploadthing) {
				const oldImageKey = oldImageUrl.substring(
					oldImageUrl.indexOf('/f/') + 3
				)
				await uploadthingApi.deleteFiles(oldImageKey)
			}
		}

		revalidatePath('/profile/edit')
		return { success: 'Successfully updated.' }
	} catch (error: any) {
		console.log('Error in `updateUser`:', error)
		return { error: error.message }
	}
}
