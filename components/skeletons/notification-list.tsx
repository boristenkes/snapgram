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
					<div
						key={index}
						className='flex items-center gap-6 p-5 w-full max-w-3xl h-[104px] bg-neutral-600/30 rounded-xl relative'
					>
						<Skeleton className='size-9 rounded-full' />

						<div className='flex items-center gap-3 w-full'>
							<Skeleton className='size-12 lg:size-16 rounded-full flex-none' />

							<div className='flex items-center justify-between gap-1 w-full'>
								<div className='space-y-1'>
									<Skeleton className='w-80 h-7' />
									<Skeleton className='w-20 h-4' />
								</div>

								<Skeleton className='size-16 rounded-lg flex-none' />
							</div>
						</div>
					</div>
				)
			)}
		</div>
	)
}
