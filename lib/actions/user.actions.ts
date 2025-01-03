'use server'

import { DEMO_ACCOUNT_ID } from '@/constants'
import { FilterQuery, SortOrder } from 'mongoose'
import { revalidatePath } from 'next/cache'
import sharp from 'sharp'
import { UTApi } from 'uploadthing/server'
import auth from '../auth'
import Chat from '../models/chat.model'
import Comment from '../models/comment.model'
import Message from '../models/message.model'
import Notification from '../models/notification.model'
import Post from '../models/post.model'
import Story from '../models/story.model'
import User from '../models/user.model'
import connectMongoDB from '../mongoose'
import { User as UserType } from '../types'
import { id, serialize, validateImage } from '../utils'
import { createUserSchema, editProfileSchema } from '../zod/user.schema'
import { deleteComment } from './comment.actions'
import { deleteNotification, sendNotification } from './notification.actions'
import { deletePost } from './post.actions'
import { deleteStory } from './story.actions'

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

		const newUser = await User.create({
			email,
			password: hashedPassword,
			username: `user_${id()}` // temporary username
		})

		return { success: true, email: newUser.email, password: newUser.password }
	} catch (error: any) {
		console.error('[CREATE_USER]:', error)
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

		if (!response)
			throw new Error('Failed to create user. Please try again later.')

		return { success: true }
	} catch (error: any) {
		console.error('[ONBOARD]:', error)
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

		return { success: true, user: serialize(user) }
	} catch (error: any) {
		console.error('[FETCH_USER]:', error)
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

		return { success: true, users: serialize(users) }
	} catch (error: any) {
		console.error('[FETCH_USERS]:', error)
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

		if (userId.toString() === DEMO_ACCOUNT_ID) {
			delete formObj.email // Email on demo account cannot be changed
		}

		if (!validationResult.success) throw new Error('Invalid data')

		await connectMongoDB()

		const image = formData.get('image') as File

		const isImageProvided = image?.name !== 'undefined' && image?.size

		let imageResponse

		if (isImageProvided) {
			const imageValidation = validateImage(image as File)

			if (!imageValidation.success) throw new Error('Invalid image')

			const imageBuffer = await image.arrayBuffer()

			const resizedBuffer = await sharp(Buffer.from(imageBuffer))
				.resize(160, 160, { fit: 'cover', position: 'center' })
				.toBuffer()

			const resizedImage = new File([resizedBuffer], image.name, {
				type: image.type
			})

			imageResponse = await uploadthingApi.uploadFiles(resizedImage)

			// imageResponse = await uploadthingApi.uploadFiles(image)

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
		console.error('[UPDATE_USER]:', error)
		return { success: false, message: error.message }
	}
}

export async function follow(formData: FormData) {
	if (!formData) return

	const { currentUserId, targetUserId } = Object.fromEntries(
		formData
	) as Record<string, string>

	try {
		await connectMongoDB()

		const currentUser = await User.findById(currentUserId)
		const isAlreadyFollower = currentUser?.following?.includes(targetUserId)

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

		await sendNotification({
			type: 'NEW_FOLLOWER',
			sender: currentUserId,
			recipient: targetUserId
		})

		revalidatePath(`/profile/${targetUserId}`)
	} catch (error: any) {
		console.error('[FOLLOW]:', error)
		return { error: 'Failed to follow user. Please try again later.' }
	}
}

export async function unfollow(formData: FormData) {
	if (!formData) return

	const { currentUserId, targetUserId } = Object.fromEntries(
		formData
	) as Record<string, string>

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

		await deleteNotification({
			type: 'NEW_FOLLOWER',
			sender: currentUserId,
			recipient: targetUserId
		})

		revalidatePath(`/profile/${targetUserId}`)
	} catch (error) {
		console.error('[UNFOLLOW]:', error)
		return { error: 'Failed to unfollow user. Please try again later.' }
	}
}

export async function sendFollowRequest(formData: FormData) {
	if (!formData) return

	const { currentUserId, targetUserId } = Object.fromEntries(
		formData
	) as Record<string, string>

	try {
		await connectMongoDB()

		const targetUser = await User.findById(targetUserId)

		if (!targetUser.followRequests.includes(currentUserId))
			targetUser.followRequests.push(currentUserId)

		await Promise.all([
			targetUser.save(),

			sendNotification({
				type: 'NEW_FOLLOW_REQUEST',
				sender: currentUserId,
				recipient: targetUserId
			})
		])

		revalidatePath(`/profile/${targetUserId}`)

		return { success: true }
	} catch (error: any) {
		console.error('[SEND_FOLLOW_REQUEST]:', error)
		return { success: false, message: error.message }
	}
}

export async function unsendFollowRequest(formData: FormData) {
	if (!formData) return

	const { currentUserId, targetUserId } = Object.fromEntries(
		formData
	) as Record<string, string>

	try {
		await connectMongoDB()

		await Promise.all([
			User.findByIdAndUpdate(targetUserId, {
				$pull: { followRequests: currentUserId }
			}),

			deleteNotification({
				type: 'NEW_FOLLOW_REQUEST',
				sender: currentUserId,
				recipient: targetUserId
			})
		])

		revalidatePath(`/profile/${targetUserId}`)

		return { success: true }
	} catch (error: any) {
		console.error('[UNSEND_FOLLOW_REQUEST]:', error)
		return { success: false, message: error.message }
	}
}

export async function acceptFollower(senderId: string, recipientId: string) {
	try {
		await connectMongoDB()

		const formData = new FormData()
		formData.set('currentUserId', senderId)
		formData.set('targetUserId', recipientId)

		await Promise.all([
			follow(formData),
			deleteNotification({
				type: 'NEW_FOLLOW_REQUEST',
				sender: senderId,
				recipient: recipientId
			}),
			User.findByIdAndUpdate(recipientId, {
				$pull: { followRequests: senderId }
			})
		])

		return { success: true }
	} catch (error: any) {
		console.error('[ACCEPT_FOLLOWER]:', error)
		return { success: false, message: error.message }
	}
}

export async function rejectFollower(senderId: string, recipientId: string) {
	try {
		await connectMongoDB()

		await Promise.all([
			User.findByIdAndUpdate(recipientId, {
				$pull: { followRequests: senderId }
			}),
			deleteNotification({
				type: 'NEW_FOLLOW_REQUEST',
				sender: senderId,
				recipient: recipientId
			})
		])

		revalidatePath('/notifications')

		return { success: true }
	} catch (error: any) {
		console.error('[REJECT_FOLLOWER]:', error)
		return { success: false, message: error.message }
	}
}

export async function searchUsers(searchTerm: string) {
	if (!searchTerm || typeof searchTerm !== 'string') return

	try {
		await connectMongoDB()

		const { user: currentUser } = await auth()

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
		console.error('[SEARCH_USERS]:', error)
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
		console.error('[HANDLE_ONBOARDING_BACK_BUTTON_CLICK]:', error)
		return { success: false, message: error.message }
	}
}

export async function switchAccountPrivate(
	userId: string,
	newIsPrivate: boolean
) {
	try {
		await connectMongoDB()

		await User.findByIdAndUpdate(userId, { private: newIsPrivate })

		return {
			success: true,
			message: `Successfully set account to ${
				newIsPrivate ? 'private' : 'public'
			}`
		}
	} catch (error: any) {
		console.error('[SWITCH_ACCOUNT_PRIVATE]:', error)
		return { success: false, message: error.message }
	}
}

export async function removeFollower(userId: string, followerId: string) {
	try {
		await connectMongoDB()

		const { user: currentUser } = await auth()

		if (currentUser._id !== userId)
			throw new Error(
				'You are not authorized to remove followers from this account'
			)

		const formData = new FormData()
		formData.set('currentUserId', followerId)
		formData.set('targetUserId', userId)

		await unfollow(formData)

		return { success: true }
	} catch (error: any) {
		console.error('[REMOVE_FOLLOWER]:', error)
		return { success: false, message: error.message }
	}
}

export async function deleteUser(filters: FilterQuery<UserType>) {
	try {
		await connectMongoDB()

		const user = await User.findOne(filters)

		if (!user) throw new Error('User not found')

		if (user._id.toString() === DEMO_ACCOUNT_ID)
			throw new Error('You cannot delete Demo account.')

		const isPictureFromUploadthing = user.image?.includes('utfs.io/f/')

		if (isPictureFromUploadthing) {
			const oldImageKey = user.image?.substring(user.image?.indexOf('/f/') + 3)
			await uploadthingApi.deleteFiles(oldImageKey)
		}

		// Define promises for each operation
		const removeFromFollowers = User.updateMany(
			{ following: user._id },
			{ $pull: { following: user._id }, $inc: { followingCount: -1 } }
		)

		const removeFromFollowing = User.updateMany(
			{ followers: user._id },
			{ $pull: { followers: user._id }, $inc: { followersCount: -1 } }
		)

		const removeFromLikes = Post.updateMany(
			{ likes: user._id },
			{ $pull: { likes: user._id }, $inc: { likeCount: -1 } }
		)

		const removeFromPostMentions = Post.updateMany(
			{ mentions: user._id },
			{ $pull: { mentions: user._id } }
		)

		const deleteUserNotifications = Notification.deleteMany({
			$or: [{ recipient: user._id }, { sender: user._id }]
		})

		const userChatsIds = await Chat.find({ participants: user._id }).then(
			chats => chats.map(chat => chat._id)
		)

		const deleteChats = Chat.deleteMany({ participants: user._id })

		const deleteMessages = Message.deleteMany({ _id: { $in: userChatsIds } })

		const [userPosts, userStories, userComments] = await Promise.all([
			Post.find({ author: user._id }),
			Story.find({ author: user._id }),
			Comment.find({ author: user._id })
		])

		await Promise.all([
			removeFromFollowers,
			removeFromFollowing,
			removeFromLikes,
			removeFromPostMentions,
			deleteUserNotifications,
			deleteChats,
			deleteMessages,
			...userPosts.map(post => deletePost(user._id, post._id)),
			...userStories.map(story => deleteStory(story._id.toString())),
			...userComments.map(comment => deleteComment(comment._id))
		])

		const response = await User.deleteOne(filters)

		if (response.deletedCount !== 1)
			throw new Error('Failed to delete user. Please try again later.')

		return { success: true, message: 'Successfully deleted account' }
	} catch (error: any) {
		console.error('[DELETE_USER]:', error)
		return { success: false, message: error.message }
	}
}
