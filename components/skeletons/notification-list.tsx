import { Skeleton } from '../ui/skeleton'

type NotificationListSkeletonProps = {
	notificationCount?: number
}

export default function NotificationListSkeleton({
	notificationCount = 6
}: NotificationListSkeletonProps) {
	return (
		<div className='space-y-4'>
			{Array.from({ length: notificationCount }, (_, index) => index).map(
				(_, index) => (
					<Skeleton
						key={index}
						className='w-full max-w-3xl h-[104px] rounded-xl'
					/>
				)
			)}
		</div>
	)
}
