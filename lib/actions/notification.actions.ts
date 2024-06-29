'use server'

import { FilterQuery, SortOrder } from 'mongoose'
import Notification from '../models/notification.model'
import connectMongoDB from '../mongoose'
import { Notification as NotificationType } from '../types'

const MAX_NOTIFICATIONS = 10

type FetchNotification =
	| { success: true; notification: NotificationType }
	| { success: false; message: string }

type FetchNotificationOptions = {
	select?: string
	populate?: [string] | [string, string]
}

export async function fetchNotification(
	conditions: Record<string, string>,
	{ select, populate }: FetchNotificationOptions = {}
): Promise<FetchNotification> {
	try {
		await connectMongoDB()

		let query = Notification.findOne(conditions, select)

		if (populate?.length) {
			query = query.populate(populate[0], populate[1])
		}

		const notification = await query.exec()

		if (!notification) throw new Error('Failed to fetch notification')

		return {
			success: true,
			notification: JSON.parse(JSON.stringify(notification))
		}
	} catch (error: any) {
		console.error('`fetchNotification`:', error)
		return { success: false, message: error.message }
	}
}

type FetchNotifications =
	| { success: true; notifications: NotificationType[] }
	| { success: false; message: string }

type FetchNotificationsOptions = FetchNotificationOptions & {
	sort?: Record<string, SortOrder>
	limit?: number
}

export async function fetchNotifications(
	conditions: Record<any, any>,
	{ select, populate, sort, limit }: FetchNotificationsOptions = {}
): Promise<FetchNotifications> {
	try {
		await connectMongoDB()

		let query = Notification.find(conditions, select)

		if (populate?.length) {
			query.populate(populate[0], populate[1])
		}

		if (sort) query.sort(sort)

		if (typeof limit === 'number') query.limit(limit)

		const notifications = await query.exec()

		if (!notifications) throw new Error('Failed to fetch notifications')

		return {
			success: true,
			notifications: JSON.parse(JSON.stringify(notifications))
		}
	} catch (error: any) {
		console.log('`fetchNotifications`:', error)
		return { success: false, message: error.message }
	}
}

export async function sendNotification(
	notificationData: Omit<NotificationType, 'createdAt' | '_id'>
) {
	const isSameUser =
		notificationData.recipient.toString() === notificationData.sender.toString()

	if (isSameUser) return

	try {
		await connectMongoDB()

		const newNotification = await Notification.create(notificationData)

		if (!newNotification) {
			throw new Error('Failed to create notification')
		}

		const countResult = await countNotifications({
			recipient: notificationData.recipient
		})

		if (!countResult.success) throw new Error(countResult.message)

		if (countResult.count > MAX_NOTIFICATIONS) {
			await Notification.findOneAndDelete(
				{ recipient: notificationData.recipient },
				{ sort: { createdAt: 1 } }
			)
		}

		return { success: true }
	} catch (error: any) {
		console.log('`sendNotification`:', error)
		return { success: false, message: error.message }
	}
}

export async function markNotificationsAsSeen(recipiendId: string) {
	try {
		await connectMongoDB()

		await Notification.updateMany(
			{ recipiend: recipiendId, seen: false },
			{ seen: true }
		)

		return { success: true }
	} catch (error: any) {
		console.log('`markNotificationsAsSeen`:', error)
		return { success: false, message: error.message }
	}
}

type CountNotifications =
	| { success: true; count: number }
	| { success: false; message: string }

export async function countNotifications(
	filters: FilterQuery<NotificationType>
): Promise<CountNotifications> {
	try {
		await connectMongoDB()

		const count = await Notification.countDocuments(filters)

		return { success: true, count }
	} catch (error: any) {
		console.log('`countNotifications`:', error)
		return { success: false, message: error.message }
	}
}

export async function deleteNotification(
	notificationData: Omit<NotificationType, 'createdAt' | '_id'>
) {
	try {
		await connectMongoDB()

		await Notification.deleteOne(notificationData)

		return { success: true }
	} catch (error: any) {
		console.log('`deleteNotification`:', error)
		return { success: false, message: error.message }
	}
}
