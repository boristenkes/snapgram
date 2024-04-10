'use server'

import connectMongoDB from '../mongoose'
import User from '../models/user.model'
import { createUserSchema, editProfileSchema } from '../zod/user.schema'
import { UTApi } from 'uploadthing/server'
import { validateImage } from '../utils'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '../session'
import { User as UserType } from '../types'
import { FilterQuery, SortOrder } from 'mongoose'

const uploadthingApi = new UTApi()

const bcrypt = require('bcrypt')

export async function createUser({ email, password }: Record<string, unknown>) {
	try {
		const validationResult = createUserSchema.safeParse({ email, password })

		if (!validationResult.success) {
			let errorMessage = ''

			const errors = validationResult.error.issues
			errors.forEach(error => {
				errorMessage += `${error.message}. `
			})

			throw new Error(errorMessage)
		}

		await connectMongoDB()

		const existingUser = await User.exists({ email })

		if (existingUser) throw new Error('User with this email already exists.')

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await User.create({ email, password: hashedPassword })

		return { success: true, email: newUser.email, password: newUser.password }
	} catch (error: any) {
		console.error('Error creating new user:', error)
		return { success: false, message: error.message }
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

		if (existingUser)
			throw new Error(
				'User with this username already exists, please choose another one.'
			)

		const response = await User.findByIdAndUpdate(userId, {
			...data,
			onboarded: true
		})

		if (response)
			throw new Error('Failed to create user. Please try again later.')

		return { success: true }
	} catch (error: any) {
		console.error('Failed to onboard user:', error)
		return { success: false, message: error.message }
	}
}

type FetchUser =
	| { success: true; user: UserType }
	| { success: false; message: string }

type FetchUserOptions = {
	select?: string
	populate?: [string] | [string, string]
}

export async function fetchUser(
	conditions: Record<string, string>,
	{ select, populate }: FetchUserOptions = {}
): Promise<FetchUser> {
	try {
		await connectMongoDB()

		let query = User.findOne(conditions, select)

		if (populate?.length) {
			query = query.populate(populate[0], populate[1])
		}

		const user = await query.exec()

		if (!user) throw new Error('Failed to fetch user')

		return { success: true, user: JSON.parse(JSON.stringify(user)) }
	} catch (error: any) {
		console.error('`fetchUser`:', error)
		return { success: false, message: error.message }
	}
}

type FetchUsers =
	| { success: true; users: UserType[] }
	| { success: false; message: string }

type FetchUsersOptions = FetchUserOptions & {
	sort?: Record<string, SortOrder>
	limit?: number
}

export async function fetchUsers(
	conditions: Record<any, any>,
	{ select, populate, sort, limit }: FetchUsersOptions = {}
): Promise<FetchUsers> {
	try {
		await connectMongoDB()

		let query = User.find(conditions, select)

		if (populate?.length) {
			query.populate(populate[0], populate[1])
		}

		if (sort) query.sort(sort)

		if (typeof limit === 'number') query.limit(limit)

		const users = await query.exec()

		if (!users) throw new Error('Failed to fetch users')

		return { success: true, users: JSON.parse(JSON.stringify(users)) }
	} catch (error: any) {
		console.log('`fetchUsers`:', error)
		return { success: false, message: error.message }
	}
}

type FormObj = Record<string, FormDataEntryValue | string>

type UpdateUserProps = {
	userId: string
	formData: FormData
	username: string
	name: string
	email: string
	bio?: string
}

export async function updateUser({
	userId,
	formData,
	username,
	name,
	email,
	bio
}: UpdateUserProps) {
	try {
		const formObj: FormObj = {
			username,
			name,
			email
		}

		// bio is only one optional so we need to check if it's even provided
		if (bio) Object.assign(formObj, { bio })

		// Server-side form validation
		const validationResult = editProfileSchema.safeParse(formObj)

		if (!validationResult.success) throw new Error('Invalid data')

		await connectMongoDB()

		const image = formData.get('image') as File

		// const image = formData.get('image') as File
		const isImageProvided = image?.name !== 'undefined' && image?.size

		let imageResponse

		if (isImageProvided) {
			const imageValidation = validateImage(image as File)

			if (!imageValidation.success) throw new Error('Invalid image')

			imageResponse = await uploadthingApi.uploadFiles(image)

			if (imageResponse?.error)
				throw new Error('Image failed to upload:' + imageResponse.error.message)

			const isRenamed = await uploadthingApi.renameFiles({
				fileKey: imageResponse?.data?.key,
				newName: `avatar_${username}`
			})
			if (!isRenamed)
				console.error('user.actions.ts/updateUser: Failed to rename image')
		}

		// If image is successfully uploaded, we're adding it to formObj
		if (imageResponse?.data?.url) formObj.image = imageResponse?.data.url

		const userBeforeUpdate = await User.findByIdAndUpdate(
			userId,
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

		return { success: true, message: 'Successfully updated.' }
	} catch (error: any) {
		console.log('Error in `updateUser`:', error)
		return { success: false, message: error.message }
	}
}

export async function follow(formData: FormData) {
	if (!formData) return

	const currentUserId = formData.get('currentUserId') as string
	const targetUserId = formData.get('targetUserId') as string

	try {
		await connectMongoDB()

		const currentUser = await User.findById(currentUserId)
		const isAlreadyFollower = currentUser?.followers?.includes(targetUserId)

		if (isAlreadyFollower) return

		await Promise.all([
			User.findByIdAndUpdate(currentUserId, {
				$push: { following: targetUserId },
				$inc: { followingCount: 1 }
			}),
			User.findByIdAndUpdate(targetUserId, {
				$push: { followers: currentUserId },
				$inc: { followersCount: 1 }
			})
		])

		revalidatePath(`/profile/${targetUserId}`)
	} catch (error: any) {
		console.log('Error in `follow`:', error)
		return { error: 'Failed to follow user. Please try again later.' }
	}
}

export async function unfollow(formData: FormData) {
	if (!formData) return

	const currentUserId = formData.get('currentUserId') as string
	const targetUserId = formData.get('targetUserId') as string

	try {
		await connectMongoDB()

		await Promise.all([
			User.findByIdAndUpdate(currentUserId, {
				$pull: { following: targetUserId },
				$inc: { followingCount: -1 }
			}),
			User.findByIdAndUpdate(targetUserId, {
				$pull: { followers: currentUserId },
				$inc: { followersCount: -1 }
			})
		])

		revalidatePath(`/profile/${targetUserId}`)
	} catch (error) {
		console.log('Error in `unfollow`:', error)
		return { error: 'Failed to unfollow user. Please try again later.' }
	}
}

export async function sendFollowRequest(formData: FormData) {
	if (!formData) return

	const currentUserId = formData.get('currentUserId') as string
	const targetUserId = formData.get('targetUserId') as string

	console.log({ action: 'sendFollowRequest' })
}

export async function unsendFollowRequest(formData: FormData) {
	if (!formData) return

	const currentUserId = formData.get('currentUserId') as string
	const targetUserId = formData.get('targetUserId') as string

	console.log({ action: 'unsendFollowRequest' })
}

export async function searchUsers(searchTerm: string) {
	if (!searchTerm || typeof searchTerm !== 'string') return

	try {
		await connectMongoDB()

		const { user: currentUser } = await getCurrentUser()

		// searching users whose `name` or `username` includes `searchTerm`
		const searchResults = await User.find({
			$and: [
				{ _id: { $ne: currentUser._id } }, // exclude current user
				{
					$or: [
						{ name: { $regex: searchTerm, $options: 'i' } },
						{ username: { $regex: searchTerm, $options: 'i' } }
					]
				}
			]
		})
			.limit(5)
			.select('image username name')

		return JSON.stringify(searchResults)
	} catch (error: any) {
		console.log('Error searching users:', error)
	}
}

export async function handleOnboardingBackButtonClick({
	email
}: {
	email: string
}) {
	try {
		await connectMongoDB()

		const response = await deleteUser({ email: email })

		return response
	} catch (error: any) {
		return { success: false, message: error.message }
	}
}

export async function deleteUser(filters: FilterQuery<UserType>) {
	try {
		await connectMongoDB()

		// TODO: Delete user's photo from uploadthing
		throw new Error('First do this 👆')

		const response = await User.deleteOne(filters)

		if (response.deletedCount !== 1)
			throw new Error('Failed to delete user. Please try again later.')

		return { success: true }
	} catch (error: any) {
		console.log('Error in `deleteUser`:', error)
		return { success: false, message: error.message }
	}
}
