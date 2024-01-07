'use server'

import connectMongoDB from '../mongoose'
import User from '../models/user.model'
import { EditProfileValidation, RegisterValidation } from '../validations/user'
import { UTApi } from 'uploadthing/server'
import { validateImage } from '../utils'
import { revalidatePath } from 'next/cache'

const uploadthingApi = new UTApi()

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
		await connectMongoDB()

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
		console.error('Error registering user:', error)
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

type FormObj = Record<string, FormDataEntryValue | string>

type UpdateUserProps = {
	_id: string
	formData: FormData
	username: string
	name: string
	email: string
	bio?: string
}

// export async function updateUser({
// 	_id,
// 	formData
// }: {
// 	_id: string
// 	formData: FormData
// }) {
export async function updateUser({
	_id,
	formData,
	username,
	name,
	email,
	bio
}: UpdateUserProps) {
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

		const formObj: FormObj = {
			username,
			name,
			email
		}

		// bio is only one optional so we need to check if it's even provided
		if (bio) Object.assign(formObj, { bio })

		console.log('formObj after bio:', formObj)

		// Server-side form validation
		const validationResult = EditProfileValidation.safeParse(formObj)

		if (!validationResult.success) {
			return { error: 'Invalid data' }
		}

		// If image is successfully uploaded, we're adding it to formObj
		if (imageResponse?.data?.url) {
			formObj.image = imageResponse?.data.url
		}

		const userBeforeUpdate = await User.findOneAndUpdate(
			{ _id },
			formObj
		).select('image')

		// Deleting old image from uploadthing, if new image is provided AND if image is successfully updated
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
