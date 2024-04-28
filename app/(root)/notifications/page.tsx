import ErrorMessage from '@/components/error-message'
import Notification from '@/components/notification'
import {
	fetchNotifications,
	markNotificationsAsSeen
} from '@/lib/actions/notification.actions'
import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'

export default async function NotificationsPage() {
	const { user: currentUser } = await getCurrentUser()

	const response = await fetchNotifications(
		{ recipient: currentUser._id },
		{
			populate: ['sender', 'image name username'],
			sort: { createdAt: 'desc' }
		}
	)

	if (response.success && response.notifications.some(notif => !notif.seen))
		await markNotificationsAsSeen(currentUser._id)

	return (
		<main className='my-20 flex-1 px-8'>
			<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5 mb-14'>
				<Image
					src='/assets/icons/notifications-neutral.svg'
					alt=''
					width={36}
					height={36}
				/>
				Notifications
			</h1>

			{response.success ? (
				response.notifications.length ? (
					<ul className='space-y-4'>
						{response.notifications.map(notification => (
							<li key={notification._id}>
								<Notification notification={notification} />
							</li>
						))}
					</ul>
				) : (
					<p className='text-neutral-500 italic'>
						You don't have any notifications
					</p>
				)
			) : (
				<ErrorMessage message={response.message} />
			)}
		</main>
	)
}
