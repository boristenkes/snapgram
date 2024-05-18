import NotificationListSkeleton from '@/components/skeletons/notification-list'
import { Skeleton } from '@/components/ui/skeleton'

export default function NotificationsLoading() {
	return (
		<div className='my-10 lg:my-20 flex-1 px-8'>
			<Skeleton className='max-w-72 w-full h-12 mb-10 lg:mb-14' />
			<NotificationListSkeleton />
		</div>
	)
}
